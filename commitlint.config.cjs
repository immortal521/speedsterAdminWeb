module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 必须有 type
    'type-empty': [2, 'never'],

    // 限制 type 范围
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],

    // subject 不能为空
    'subject-empty': [2, 'never'],

    // 必须有冒号格式（默认就是 type: subject）
  },
};
