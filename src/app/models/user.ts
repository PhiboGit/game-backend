import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		characterName: {
			type: String,
			required: true,
			unique: true,
			index: true
		},
		password: {
			type: String,
			required: true
		},
		email: String,
        tokens: [],
		createdAt: Date,
		updatedAt: Date,
	},
	{ collection: 'users' }
)

const User = mongoose.model('UserSchema', UserSchema)

// Create a unique compound index with a collation that supports case-insensitive comparisons (strength: 2)
User.collection.createIndex({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 }, name: 'username_unique'  })
User.collection.createIndex({ characterName: 1 }, { unique: true, collation: { locale: 'en', strength: 2 }, name: 'characterName_unique'  })

export default User