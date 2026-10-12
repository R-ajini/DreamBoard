import bcrypt from 'bcryptjs';

let idSeq = 1;
const nextId = () => String(idSeq++);

const state = {
  users: [],
  dreams: [],
  goals: [],
  tasks: [],
  achievements: [],
};

export function seedDemoUser() {
  if (state.users.length > 0) return;
  const passwordHash = bcrypt.hashSync('dreamboard123', 10);
  state.users.push({
    id: nextId(),
    email: 'you@dreamboard.local',
    passwordHash,
    createdAt: new Date().toISOString(),
  });
}

export const memoryStore = {
  async findUserByEmail(email) {
    return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  },

  async findUserById(id) {
    return state.users.find((u) => u.id === id) ?? null;
  },

  async createUser({ email, passwordHash }) {
    const user = {
      id: nextId(),
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    state.users.push(user);
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  },

  async listDreams(userId, { search, category, status } = {}) {
    let rows = state.dreams.filter((d) => d.userId === userId);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.description || '').toLowerCase().includes(q),
      );
    }
    if (category) rows = rows.filter((d) => d.category === category);
    if (status) rows = rows.filter((d) => d.status === status);
    return rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getDream(userId, id) {
    const dream = state.dreams.find((d) => d.id === id && d.userId === userId);
    return dream ?? null;
  },

  async createDream(userId, data) {
    const dream = {
      id: nextId(),
      userId,
      title: data.title,
      description: data.description || '',
      category: data.category || 'General',
      imageUrl: data.imageUrl || null,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.dreams.push(dream);
    return dream;
  },

  async updateDream(userId, id, data) {
    const dream = state.dreams.find((d) => d.id === id && d.userId === userId);
    if (!dream) return null;
    Object.assign(dream, data, { updatedAt: new Date().toISOString() });
    return dream;
  },

  async deleteDream(userId, id) {
    const idx = state.dreams.findIndex((d) => d.id === id && d.userId === userId);
    if (idx === -1) return false;
    state.dreams.splice(idx, 1);
    const goalIds = state.goals.filter((g) => g.dreamId === id).map((g) => g.id);
    state.goals = state.goals.filter((g) => g.dreamId !== id);
    state.tasks = state.tasks.filter((t) => !goalIds.includes(t.goalId));
    return true;
  },

  async listGoals(userId, { dreamId, status } = {}) {
    let rows = state.goals.filter((g) => g.userId === userId);
    if (dreamId) rows = rows.filter((g) => g.dreamId === dreamId);
    if (status) rows = rows.filter((g) => g.status === status);
    return rows.sort((a, b) => new Date(a.targetDate || 0) - new Date(b.targetDate || 0));
  },

  async getGoal(userId, id) {
    return state.goals.find((g) => g.id === id && g.userId === userId) ?? null;
  },

  async createGoal(userId, data) {
    const goal = {
      id: nextId(),
      userId,
      dreamId: data.dreamId,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'medium',
      targetDate: data.targetDate || null,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.goals.push(goal);
    return goal;
  },

  async updateGoal(userId, id, data) {
    const goal = state.goals.find((g) => g.id === id && g.userId === userId);
    if (!goal) return null;
    const wasCompleted = goal.status === 'completed';
    Object.assign(goal, data, { updatedAt: new Date().toISOString() });
    if (!wasCompleted && goal.status === 'completed') {
      state.achievements.push({
        id: nextId(),
        userId,
        goalId: goal.id,
        title: goal.title,
        completedAt: new Date().toISOString(),
      });
    }
    return goal;
  },

  async deleteGoal(userId, id) {
    const idx = state.goals.findIndex((g) => g.id === id && g.userId === userId);
    if (idx === -1) return false;
    state.goals.splice(idx, 1);
    state.tasks = state.tasks.filter((t) => t.goalId !== id);
    state.achievements = state.achievements.filter((a) => a.goalId !== id);
    return true;
  },

  async listTasks(userId, { goalId } = {}) {
    const userGoalIds = new Set(state.goals.filter((g) => g.userId === userId).map((g) => g.id));
    let rows = state.tasks.filter((t) => userGoalIds.has(t.goalId));
    if (goalId) rows = rows.filter((t) => t.goalId === goalId);
    return rows.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  async createTask(userId, data) {
    const goal = state.goals.find((g) => g.id === data.goalId && g.userId === userId);
    if (!goal) return null;
    const existing = state.tasks.filter((t) => t.goalId === data.goalId);
    const task = {
      id: nextId(),
      goalId: data.goalId,
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium',
      completed: Boolean(data.completed),
      completedAt: data.completed ? new Date().toISOString() : null,
      sortOrder: existing.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.tasks.push(task);
    return task;
  },

  async updateTask(userId, id, data) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return null;
    const goal = state.goals.find((g) => g.id === task.goalId && g.userId === userId);
    if (!goal) return null;
    if (data.completed === true && !task.completed) {
      task.completedAt = new Date().toISOString();
    }
    if (data.completed === false) {
      task.completedAt = null;
    }
    Object.assign(task, data, { updatedAt: new Date().toISOString() });
    return task;
  },

  async deleteTask(userId, id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return false;
    const goal = state.goals.find((g) => g.id === task.goalId && g.userId === userId);
    if (!goal) return false;
    state.tasks = state.tasks.filter((t) => t.id !== id);
    return true;
  },

  async listAchievements(userId) {
    return state.achievements
      .filter((a) => a.userId === userId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  async getDashboard(userId) {
    const dreams = state.dreams.filter((d) => d.userId === userId);
    const goals = state.goals.filter((g) => g.userId === userId);
    const tasks = await this.listTasks(userId);
    const activeGoals = goals.filter((g) => g.status === 'active');
    const completedGoals = goals.filter((g) => g.status === 'completed');

    const goalsWithProgress = activeGoals.map((goal) => {
      const goalTasks = tasks.filter((t) => t.goalId === goal.id);
      const done = goalTasks.filter((t) => t.completed).length;
      const total = goalTasks.length;
      const progress = total === 0 ? 0 : Math.round((done / total) * 100);
      return { ...goal, progress, taskTotal: total, taskDone: done };
    });

    const upcoming = tasks
      .filter((t) => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 8)
      .map((t) => {
        const goal = goals.find((g) => g.id === t.goalId);
        return { ...t, goalTitle: goal?.title ?? 'Goal' };
      });

    return {
      dreamCount: dreams.length,
      activeGoalCount: activeGoals.length,
      completedGoalCount: completedGoals.length,
      goalsWithProgress,
      upcomingDeadlines: upcoming,
      recentDreams: dreams.slice(0, 4),
    };
  },

  async exportUserData(userId) {
    const dreams = await this.listDreams(userId);
    const goals = await this.listGoals(userId);
    const tasks = await this.listTasks(userId);
    const achievements = await this.listAchievements(userId);
    return { dreams, goals, tasks, achievements, exportedAt: new Date().toISOString() };
  },

  async deleteAllUserData(userId) {
    const goalIds = state.goals.filter((g) => g.userId === userId).map((g) => g.id);
    state.tasks = state.tasks.filter((t) => !goalIds.includes(t.goalId));
    state.dreams = state.dreams.filter((d) => d.userId !== userId);
    state.goals = state.goals.filter((g) => g.userId !== userId);
    state.achievements = state.achievements.filter((a) => a.userId !== userId);
    return true;
  },
};

seedDemoUser();
