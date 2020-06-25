const prompts_obj = {}
prompts_obj.action = [
    {
        type: "list",
        message: "What CRUD action would you like to?",
        choices: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
        name: "action"
    }
];
prompts_obj.table = [
    {
        type: "list",
        message: "FROM which table?",
        choices: ['employee', 'department', 'role'],
        name: "table"
    }
];
prompts_obj.filter_by_column = [
    {
        type: "list",
        message: "With?",
        choices: ['name'],
        name: "filter_by"
    }
];
prompts_obj.filter_by_value = [
    {
        type: "list",
        message: "Equal to?",
        choices: ['*'],
        name: "choice"
    }
];
prompts_obj.update_column = [
    {
        type: "list",
        message: "Set what column?",
        choices: ['name', 'role'],
        name: "update_choice"
    }
];
prompts_obj.update_value = [
    {
        type: "input",
        message: "Set value to?",
        name: "update_value"
    }
];

module.exports = prompts_obj;