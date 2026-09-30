import fs from 'fs';
import path from 'path';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  unlockedSections: string[];
  xp: number;
  streak: number;
  createdAt: string;
}

export interface UserProgressEntity {
  id: string;
  userId: string;
  sectionId: string;
  examType: string;
  scorePercentage: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timestamp: string;
}

export interface UserSettingsEntity {
  userId: string;
  dailyGoal: number;
  autoAdvanceMs: number;
  soundEnabled: boolean;
  theme: string;
  geminiKey: string;
  updatedAt: string;
}

export interface VocabEntity {
  id: string;
  gujarati: string;
  english: string;
  pronunciation_gujarati?: string;
  phonetic?: string;
  english_pronunciation?: string;
  category?: string;
  difficulty?: string;
  example?: string;
  sectionId: string;
  sectionName: string;
}

export interface SentenceEntity {
  id: string;
  english: string;
  gujarati: string;
  answers?: string[];
  topic?: string;
  sectionKey?: string;
  difficulty?: string;
  hint?: string;
}

export interface NotificationEntity {
  id: string;
  userId: string; // target userId or 'all' for broadcast
  title: string;
  message: string;
  type: 'module_unlock' | 'new_content' | 'achievement' | 'system';
  readBy: string[];
  createdAt: string;
}

interface DatabaseSchema {
  users: UserEntity[];
  progress: UserProgressEntity[];
  settings: Record<string, UserSettingsEntity>;
  vocabulary: VocabEntity[];
  sentences: SentenceEntity[];
  notifications: NotificationEntity[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');
const DB_BAK_PATH = path.join(process.cwd(), 'data', 'db.json.bak');

class DataStore {
  private data: DatabaseSchema = {
    users: [],
    progress: [],
    settings: {},
    vocabulary: [],
    sentences: [],
    notifications: [],
  };
  private lastMtime: number = 0;

  constructor() {
    this.init();
  }

  private restoreFromBackup(): boolean {
    try {
      if (fs.existsSync(DB_BAK_PATH)) {
        const raw = fs.readFileSync(DB_BAK_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          this.data = parsed;
          if (!this.data.notifications) this.data.notifications = [];
          console.log(`[DataStore] Successfully restored ${parsed.users.length} users from backup file.`);
          this.save();
          return true;
        }
      }
    } catch (err) {
      console.error('[DataStore] Failed to restore from backup:', err);
    }
    return false;
  }

  private reloadIfNeeded() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const stat = fs.statSync(DB_FILE_PATH);
        if (stat.mtimeMs > this.lastMtime) {
          const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.users)) {
            // Keep existing users if parsed users is unexpectedly empty while current memory has users
            if (parsed.users.length === 0 && this.data.users.length > 0) {
              console.warn('[DataStore] Parsed file has 0 users but memory has active users. Retaining memory users.');
            } else {
              this.data = parsed;
              if (!this.data.notifications) this.data.notifications = [];
            }
            this.lastMtime = stat.mtimeMs;
          }
        }
      }
    } catch (err) {
      console.warn('[DataStore] Read error on DB reload, keeping current memory state:', err);
    }
  }

  private init() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          this.data = parsed;
          if (!this.data.notifications) {
            this.data.notifications = [];
          }
          this.lastMtime = fs.statSync(DB_FILE_PATH).mtimeMs;
        } else {
          console.warn('[DataStore] Invalid db.json structure, attempting backup restoration...');
          this.restoreFromBackup();
        }
      } else {
        if (!this.restoreFromBackup()) {
          this.save();
        }
      }
    } catch (err) {
      console.error('[DataStore] Failed to initialize from primary file, attempting backup restoration:', err);
      this.restoreFromBackup();
    }
  }

  public save() {
    const tmpPath = DB_FILE_PATH + '.tmp';
    try {
      const payload = JSON.stringify(this.data, null, 2);

      // 1. Atomic write to temporary file first
      fs.writeFileSync(tmpPath, payload, 'utf-8');

      // 2. Atomic rename to target path
      fs.renameSync(tmpPath, DB_FILE_PATH);

      if (fs.existsSync(DB_FILE_PATH)) {
        this.lastMtime = fs.statSync(DB_FILE_PATH).mtimeMs;
      }

      // 3. Update backup file if users list is non-empty
      if (this.data.users && this.data.users.length > 0) {
        fs.writeFileSync(DB_BAK_PATH, payload, 'utf-8');
      }
    } catch (err) {
      console.error('[DataStore] Failed to write to DB file:', err);
      if (fs.existsSync(tmpPath)) {
        try {
          fs.unlinkSync(tmpPath);
        } catch (_) {}
      }
    }
  }

  // Users
  public getUsers(): UserEntity[] {
    this.reloadIfNeeded();
    return this.data.users;
  }

  public findUserByEmail(email: string): UserEntity | undefined {
    this.reloadIfNeeded();
    const target = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email.trim().toLowerCase() === target);
  }

  public findUserById(id: string): UserEntity | undefined {
    this.reloadIfNeeded();
    return this.data.users.find((u) => u.id === id);
  }

  public addUser(user: UserEntity): UserEntity {
    this.reloadIfNeeded();
    user.email = user.email.trim().toLowerCase();
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<UserEntity>): UserEntity | undefined {
    this.reloadIfNeeded();
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      if (updates.email) {
        updates.email = updates.email.trim().toLowerCase();
      }
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return undefined;
  }

  // Progress
  public addProgress(prog: UserProgressEntity): UserProgressEntity {
    this.reloadIfNeeded();
    this.data.progress.push(prog);
    this.save();
    return prog;
  }

  public getProgressByUserId(userId: string): UserProgressEntity[] {
    this.reloadIfNeeded();
    return this.data.progress
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Settings
  public getSettings(userId: string): UserSettingsEntity {
    this.reloadIfNeeded();
    if (!this.data.settings[userId]) {
      this.data.settings[userId] = {
        userId,
        dailyGoal: 10,
        autoAdvanceMs: 700,
        soundEnabled: true,
        theme: 'light',
        geminiKey: '',
        updatedAt: new Date().toISOString(),
      };
      this.save();
    }
    return this.data.settings[userId];
  }

  public saveSettings(userId: string, updates: Partial<UserSettingsEntity>): UserSettingsEntity {
    this.reloadIfNeeded();
    const current = this.getSettings(userId);
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.settings[userId] = updated;
    this.save();
    return updated;
  }

  // Vocabulary Content
  public setVocabulary(items: VocabEntity[]) {
    this.reloadIfNeeded();
    this.data.vocabulary = items;
    this.save();
  }

  public getVocabulary(sectionId?: string): VocabEntity[] {
    this.reloadIfNeeded();
    if (!sectionId || sectionId === 'all') {
      return this.data.vocabulary;
    }
    return this.data.vocabulary.filter((v) => v.sectionId === sectionId);
  }

  // Sentences Content
  public setSentences(items: SentenceEntity[]) {
    this.reloadIfNeeded();
    this.data.sentences = items;
    this.save();
  }

  public getSentences(topic?: string): SentenceEntity[] {
    this.reloadIfNeeded();
    if (!topic || topic === 'all') {
      return this.data.sentences;
    }
    const normalized = topic.toLowerCase();
    return this.data.sentences.filter(
      (s) =>
        (s.topic && s.topic.toLowerCase() === normalized) ||
        (s.sectionKey && s.sectionKey.toLowerCase() === normalized)
    );
  }

  // Notifications
  public getNotificationsForUser(userId: string): NotificationEntity[] {
    this.reloadIfNeeded();
    if (!this.data.notifications) this.data.notifications = [];
    return this.data.notifications
      .filter((n) => (n.userId === userId || n.userId === 'all') && !n.readBy.includes(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(
    notification: Omit<NotificationEntity, 'id' | 'readBy' | 'createdAt'> & {
      id?: string;
      readBy?: string[];
      createdAt?: string;
    }
  ): NotificationEntity {
    this.reloadIfNeeded();
    if (!this.data.notifications) this.data.notifications = [];
    const newNotif: NotificationEntity = {
      id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      readBy: notification.readBy || [],
      createdAt: notification.createdAt || new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  public markNotificationAsRead(userId: string, notificationId: string): boolean {
    this.reloadIfNeeded();
    if (!this.data.notifications) this.data.notifications = [];
    const notif = this.data.notifications.find((n) => n.id === notificationId);
    if (notif) {
      if (!notif.readBy.includes(userId)) {
        notif.readBy.push(userId);
        this.save();
      }
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.reloadIfNeeded();
    if (!this.data.notifications) this.data.notifications = [];
    let updated = false;
    for (const notif of this.data.notifications) {
      if ((notif.userId === userId || notif.userId === 'all') && !notif.readBy.includes(userId)) {
        notif.readBy.push(userId);
        updated = true;
      }
    }
    if (updated) {
      this.save();
    }
  }
}

export const db = new DataStore();

