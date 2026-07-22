const { User } = require("../models");

async function actualizeUserBlock(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
        return {
            exists: false,
            blocked: false,
        };
    }

    if (!user.is_blocked) {
        return {
            exists: true,
            blocked: false,
            user,
        };
    }

    const isTemporaryBlock = Boolean(user.blocked_until);

    if (
        isTemporaryBlock &&
        new Date(user.blocked_until).getTime() <= Date.now()
    ) {
        user.is_blocked = false;
        user.blocked_until = null;
        user.block_reason = null;

        await user.save();

        return {
            exists: true,
            blocked: false,
            user,
        };
    }

    return {
        exists: true,
        blocked: true,
        reason: user.block_reason,
        blockedUntil: user.blocked_until,
        permanent: user.blocked_until === null,
        user,
    };
}

module.exports = actualizeUserBlock;