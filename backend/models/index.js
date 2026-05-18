const sequelize = require("../db");

const User = require("./user/User")(sequelize);
const UserDocument = require("./user/UserDocument")(sequelize);

const Program = require("./learning/Program")(sequelize);
const Theme = require("./learning/Theme")(sequelize);
const Punct = require("./learning/Punct")(sequelize);
const File = require("./learning/File")(sequelize);
const FileAsset = require("./learning/FileAsset")(sequelize);
const Test = require("./learning/Test")(sequelize);
const Question = require("./learning/Question")(sequelize);
const Answer = require("./learning/Answer")(sequelize);
const TestQuestionLink = require("./learning/TestQuestionLink")(sequelize);

const Enrollment = require("./enrollment/Enrollment")(sequelize);
const Certificate = require("./enrollment/Certificate")(sequelize);
const UserContentProgress = require("./enrollment/UserContentProgress")(sequelize);
const TestAttempt = require("./enrollment/TestAttempt")(sequelize);
const TestAttemptAnswer = require("./enrollment/TestAttemptAnswer")(sequelize);

const Chat = require("./chat/Chat")(sequelize);
const Message = require("./chat/Message")(sequelize);
const MessageAttachment = require("./chat/MessageAttachment")(sequelize);

const Event = require("./misc/Event")(sequelize);
const Application = require("./misc/Application")(sequelize);
const PracticalWork = require("./misc/PracticalWork")(sequelize);

const models = {
    Event,
    User,
    UserDocument,
    Program,
    Theme,
    Punct,
    File,
    FileAsset,
    Application,
    Test,
    Question,
    Answer,
    Chat,
    Message,
    MessageAttachment,
    Enrollment,
    PracticalWork,
    TestAttempt,
    TestAttemptAnswer,
    UserContentProgress,
    Certificate,
    TestQuestionLink,
};

require("./associations")(models);
require("./hooks")(models);

module.exports = models;