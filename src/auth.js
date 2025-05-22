import db from './db';
import bcrypt from 'bcryptjs';

export async function signUp(email, password, firstName, lastName, role) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (email, password, first_name, last_name, role) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(email, hashedPassword, firstName, lastName, role);
    
    return { success: true };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function signIn(email, password) {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    // Remove password from user object before returning
    delete user.password;
    return { user };
  } catch (error) {
    throw error;
  }
}