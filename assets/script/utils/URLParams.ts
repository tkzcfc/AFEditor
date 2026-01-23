export class URLParams {
    private params: Map<string, string> = new Map();

    append(key: string, value: any): void {
        this.params.set(key, String(value));
    }

    toString(): string {
        const parts: string[] = [];
        this.params.forEach((value, key) => {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
        return parts.join('&');
    }

    // 模拟 URLSearchParams 的其他方法
    set(key: string, value: any): void {
        this.params.set(key, String(value));
    }

    get(key: string): string | null {
        return this.params.get(key) || null;
    }

    has(key: string): boolean {
        return this.params.has(key);
    }

    delete(key: string): void {
        this.params.delete(key);
    }

    keys(): IterableIterator<string> {
        return this.params.keys();
    }

    values(): IterableIterator<string> {
        return this.params.values();
    }
}
