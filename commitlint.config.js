const RuleConfigSeverity = {
  Disabled: 0,
  Warning: 1,
  Error: 2,
};

const SpellCaseValues = [
  "lower-case", // default
  "upper-case", // UPPERCASE
  "camel-case", // camelCase
  "kebab-case", // kebab-case
  "pascal-case", // PascalCase
  "sentence-case", // Sentence case
  "snake-case", // snake_case
  "start-case", // Start Case
];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-case": [RuleConfigSeverity.Error, "always", SpellCaseValues[0]], // commit 类型后面接的标题
    "header-max-length": [RuleConfigSeverity.Error, "always", 50],
    "header-min-length": [RuleConfigSeverity.Error, "always", 2],
    "header-trim": [RuleConfigSeverity.Error, "always"], // 标题没有空格
    "header-full-stop": [RuleConfigSeverity.Error, "never", "."], // header 标题是否以句号结尾，never为否

    "body-empty": [RuleConfigSeverity.Error, "always"], // 允许commit body为空
    "body-leading-blank": [RuleConfigSeverity.Error, "always"], // 写commit内容前需要一个空行， body为标题后面的commit详细描述
    "body-max-length": [RuleConfigSeverity.Error, "always", 100], // commit可以写20个字符
    "body-min-length": [RuleConfigSeverity.Error, "always", 0], // commit 描述内容
    "body-max-line-length": [RuleConfigSeverity.Error, "always", 2], // commit 最多两行
    "body-case": [RuleConfigSeverity.Error, "always", SpellCaseValues[0]], // commit 内容小写

    "footer-empty": [RuleConfigSeverity.Error, "always"],
    "footer-leading-blank": [RuleConfigSeverity.Error, "always"], // 页脚前是否需要一个空行

    "type-enum": [
      RuleConfigSeverity.Error,
      "always",
      [
        "build", // 构建相关的变更，如修改构建脚本、构建工具或外部依赖的更新。
        "chore", // 其他不涉及代码或测试的变更，例如文档更新、代码格式化、重命名文件等。
        "ci", // 与持续集成（CI）和持续部署（CD）相关的变更，例如配置 CI/CD、依赖更新等。
        "docs", // 文档更新，如更新文档内容、添加注释、修改文档结构等。
        "feat", // 新增功能或功能的变更。
        "fix", // 修复 bug 或错误。
        "perf", // 性能优化相关的变更
        "refactor", // 代码重构，不涉及功能添加或修复 bug。
        "revert", // 撤销先前的提交。
        "style", // 与代码风格、格式化相关的变更，如空格、缩进、分号等。
        "test", // 新增或修改测试相关的代码。
      ], // 提交消息类型
    ],
    "type-case": [RuleConfigSeverity.Error, "always", SpellCaseValues[0]], // 提交消息类型 小写
  },
  prompt: {
    alias: { fd: "docs: fix typos" },
    messages: {
      type: "请选择提交类型：",
      scope: "表示此更改的范围(可选):",
      customScope: "Denote the SCOPE of this change:",
      subject: "针对改动写一个简短的描述:\n",
      body: '提供更长的变更描述(可选)。使用"|"换行:\n',
      breaking: '列出任何重大更改(可选)。使用"|"换行:\n',
      footerPrefixesSelect:
        "Select the ISSUES type of changeList by this change (optional):",
      customFooterPrefix: "Input ISSUES prefix:",
      footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
      generatingByAI: "Generating your AI commit subject...",
      generatedSelectByAI: "Select suitable subject by AI generated:",
      confirmCommit: "确定要提交 commit 么?",
    },
    types: [
      {
        value: "feat",
        name: "feat:     🚀  一个新的功能",
        emoji: "🚀",
      },
      {
        value: "fix",
        name: "fix:      🧩  bug 修复",
        emoji: "🧩",
      },
      {
        value: "docs",
        name: "docs:     📚  文档变更",
        emoji: "📚",
      },
      {
        value: "style",
        name: "style:    🎨  样式修复",
        emoji: "🎨",
      },
      {
        value: "refactor",
        name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
        emoji: "♻️",
      },
      {
        value: "perf",
        name: "perf:     ⚡️  A code change that improves performance",
        emoji: "⚡️",
      },
      {
        value: "test",
        name: "test:     ✅  测试代码修改与添加",
        emoji: "✅",
      },
      {
        value: "build",
        name: "build:    📦️   Changes that affect the build system or external dependencies",
        emoji: "📦️",
      },
      {
        value: "ci",
        name: "ci:       🎡  环境配置文件变更",
        emoji: "🎡",
      },
      {
        value: "chore",
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: "🔨",
      },
      {
        value: "revert",
        name: "revert:   ⏪️  Reverts a previous commit",
        emoji: "⏪️",
      },
    ],
    useEmoji: true,
    emojiAlign: "center",
    useAI: false,
    aiNumber: 1,
    themeColorCode: "",
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: "bottom",
    customScopesAlias: "custom",
    emptyScopesAlias: "empty",
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ["feat", "fix"],
    breaklineNumber: 100,
    breaklineChar: "|",
    skipQuestions: [],
    issuePrefixes: [
      { value: "closed", name: "closed:   ISSUES has been processed" },
    ],
    customIssuePrefixAlign: "top",
    emptyIssuePrefixAlias: "skip",
    customIssuePrefixAlias: "custom",
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: "",
    defaultIssues: "",
    defaultScope: "",
    defaultSubject: "",
  },
};
