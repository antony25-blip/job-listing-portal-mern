const mongoose = require('mongoose');

// In-memory storage as fallback
let users = [];
let nextId = 1;

class InMemoryUser {
    constructor({ id, name, email, password = null, googleId = null, provider = 'local' }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;   // null for Google users
        this.googleId = googleId;   // null for local users
        this.provider = provider;   // 'local' | 'google'
    }
}

class InMemoryUserModel {

    // 🔍 Find user by email or googleId
    static async findOne(query) {
        if (query.email) {
            return users.find(user => user.email === query.email) || null;
        }
        if (query.googleId) {
            return users.find(user => user.googleId === query.googleId) || null;
        }
        return null;
    }

    // ➕ Create new user (local or google)
    static async create(userData) {
        const newUser = new InMemoryUser({
            id: nextId++,
            name: userData.name,
            email: userData.email,
            password: userData.password || null,
            googleId: userData.googleId || null,
            provider: userData.provider || 'local'
        });

        users.push(newUser);
        return newUser;
    }

    // 💾 Save (not required for in-memory)
    async save() {
        return Promise.resolve(this);
    }

    // 🧪 Optional: get all users (debugging)
    static async find() {
        return users;
    }
}

// Force use of in-memory storage
console.log('Using in-memory storage for user storage (local + Google auth)');

module.exports = InMemoryUserModel;
 