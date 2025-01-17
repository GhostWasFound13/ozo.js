class Cache extends Map {
    constructor(entries = []) {
        super(entries);
    }

    // Set a cache entry
    set(name, value) {
        super.set(name, value);
        return this;
    }

    // Get a cache entry
    get(name) {
        return super.get(name);
    }

    // Delete a cache entry
    delete(name) {
        return super.delete(name);
    }

    // Check if a cache entry exists
    has(name) {
        return super.has(name);
    }

    // Clear all cache entries
    clear() {
        return super.clear();
    }

    // Return the size of the cache
    get size() {
        return super.size;
    }

    // Return all cache values
    values() {
        return Array.from(super.values());
    }

    // Return all cache keys
    keys() {
        return Array.from(super.keys());
    }

    // Return all cache entries as [key, value] pairs
    entries() {
        return Array.from(super.entries());
    }

    // Iterate over the cache values
    forEach(callback) {
        super.forEach((value, key) => callback(value, key, this));
    }

    // Map over cache entries and return an array of mapped values
    map(fn) {
        return Array.from(this).map(([key, value]) => fn(value, key, this));
    }

    // Filter cache entries based on a condition
    filter(fn) {
        return Array.from(this).filter(([key, value]) => fn(value, key, this));
    }

    // Find a cache entry that matches a condition
    find(fn) {
        const entry = Array.from(this).find(([key, value]) => fn(value, key, this));
        return entry ? entry[1] : undefined;
    }

    // Sort cache entries by a custom comparator
    sort(compareFn) {
        const entries = Array.from(this);
        entries.sort(([keyA, valueA], [keyB, valueB]) => compareFn(valueA, valueB, keyA, keyB));
        return new Cache(entries);
    }

    // Create a new cache from a filtered subset of the current cache
    subset(fn) {
        const subset = Array.from(this).filter(([key, value]) => fn(value, key, this));
        return new Cache(subset);
    }

    // Chainable way to get and set cache entries
    getSet(name, value) {
        const entry = this.get(name);
        if (entry) return entry;
        this.set(name, value);
        return value;
    }
}

module.exports = Cache;
