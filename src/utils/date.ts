export const dateUtils = {
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  parseDate(dateStr: string): Date {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  },

  isExpired(deadlineStr: string): boolean {
    if (!deadlineStr) return false;
    const deadline = this.parseDate(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
  },

  getDaysRemaining(deadlineStr: string): number {
    if (!deadlineStr) return 0;
    const deadline = this.parseDate(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  generateDeadlineOptions(): { label: string; value: string }[] {
    const today = new Date();
    const options = [
      { label: '1天', value: this.formatDate(this.addDays(today, 1)) },
      { label: '3天', value: this.formatDate(this.addDays(today, 3)) },
      { label: '7天', value: this.formatDate(this.addDays(today, 7)) },
      { label: '15天', value: this.formatDate(this.addDays(today, 15)) },
      { label: '30天', value: this.formatDate(this.addDays(today, 30)) }
    ];
    return options;
  },

  getCurrentDateTime(): string {
    return new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
