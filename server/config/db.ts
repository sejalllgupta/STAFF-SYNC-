import {
  INITIAL_USERS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRAININGS,
  INITIAL_PERFORMANCES
} from '../seed/seedData';
import {
  User,
  Attendance,
  LeaveRequest,
  Announcement,
  Training,
  Performance
} from '../models/types';

class Collection<T extends { _id: string }> {
  private items: T[] = [];

  constructor(initialData: T[] = []) {
    this.items = JSON.parse(JSON.stringify(initialData));
  }

  setData(data: T[]) {
    this.items = JSON.parse(JSON.stringify(data));
  }

  async find(query?: Partial<T> | ((item: T) => boolean)): Promise<T[]> {
    if (!query) return [...this.items];
    if (typeof query === 'function') {
      return this.items.filter(query);
    }
    return this.items.filter(item => {
      return Object.entries(query).every(([k, v]) => (item as any)[k] === v);
    });
  }

  async findOne(query: Partial<T> | ((item: T) => boolean)): Promise<T | null> {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.find(i => i._id === id);
    return item ? { ...item } : null;
  }

  async create(doc: Omit<T, '_id'> & { _id?: string }): Promise<T> {
    const newDoc = {
      ...doc,
      _id: doc._id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    } as T;
    this.items.unshift(newDoc);
    return { ...newDoc };
  }

  async findByIdAndUpdate(id: string, updates: Partial<T>): Promise<T | null> {
    const index = this.items.findIndex(i => i._id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...updates };
    return { ...this.items[index] };
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const index = this.items.findIndex(i => i._id === id);
    if (index === -1) return null;
    const removed = this.items.splice(index, 1)[0];
    return removed;
  }

  async countDocuments(query?: Partial<T> | ((item: T) => boolean)): Promise<number> {
    const list = await this.find(query);
    return list.length;
  }
}

// Global in-memory collections initialized with rich seed data
export const UserModel = new Collection<User>(INITIAL_USERS);
export const AttendanceModel = new Collection<Attendance>(INITIAL_ATTENDANCE);
export const LeaveModel = new Collection<LeaveRequest>(INITIAL_LEAVES);
export const AnnouncementModel = new Collection<Announcement>(INITIAL_ANNOUNCEMENTS);
export const TrainingModel = new Collection<Training>(INITIAL_TRAININGS);
export const PerformanceModel = new Collection<Performance>(INITIAL_PERFORMANCES);

export const resetDatabaseToSeed = () => {
  UserModel.setData(INITIAL_USERS);
  AttendanceModel.setData(INITIAL_ATTENDANCE);
  LeaveModel.setData(INITIAL_LEAVES);
  AnnouncementModel.setData(INITIAL_ANNOUNCEMENTS);
  TrainingModel.setData(INITIAL_TRAININGS);
  PerformanceModel.setData(INITIAL_PERFORMANCES);
  return { success: true, message: 'Database reset to default seed state' };
};
