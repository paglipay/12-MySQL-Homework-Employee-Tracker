var inquirer = require("inquirer");
var mysql = require("mysql");
const util = require('util');
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "P@ssw0rd",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
});
// node native promisify
const custom_query = util.promisify(connection.query).bind(connection);

let sql_query_obj = [];

async function myIncuire(chioces) {
    let response = await inquirer.prompt(chioces);
    if (response.choice !== '') {
        console.log("Success!");
        return response;
    }
    else {
        console.log("You inputed a blank?!");
    }
}

let choice_list = [];
choice_list.push([
    {
        type: "list",
        message: "What CRUD action would you like to?",
        choices: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
        name: "action"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "FROM which table?",
        choices: ['employee', 'department', 'role'],
        name: "table"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "With?",
        choices: ['name'],
        name: "filter_by"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "Equal to?",
        choices: ['*'],
        name: "choice"
    }
]);

choice_list.push([
    {
        type: "list",
        message: "Set what column?",
        choices: ['name', 'role'],
        name: "update_choice"
    }
]);

choice_list.push([
    {
        type: "input",
        message: "Set value to?",
        name: "update_value"
    }
]);

let prompts_obj = {}
prompts_obj.action = choice_list[0];
prompts_obj.table = choice_list[1];
prompts_obj.filter_by_column = choice_list[2];
prompts_obj.filter_by_value = choice_list[3];
prompts_obj.update_column = choice_list[4];
prompts_obj.update_value = choice_list[5];

(async () => {
    let res_table = ''
    let res

    res = await myIncuire(prompts_obj.action);
    sql_query_obj.push(res);
    if (res.action === 'INSERT') {
        let question_list = ['table', 'update_value'];
        for (let i = 0; i < question_list.length; i++) {
            res = await myIncuire(prompts_obj[question_list[i]]);
            sql_query_obj.push(res);
        }
    } else if (res.action === 'UPDATE') {
        let question_list = ['table', 'filter_by_column', 'filter_by_value', 'update_column', 'update_value'];
        for (let i = 0; i < question_list.length; i++) {
            if (prompts_obj[question_list[i]][0].name === 'choice') {
                res_filter_by = sql_query_obj.filter(item => item.filter_by !== undefined)
                res_table = sql_query_obj.filter(item => item.table !== undefined)
                prompts_obj[question_list[i]][0].choices = await custom_query('SELECT ' + res_filter_by[0].filter_by + ' FROM ' + res_table[0].table);
            }
            res = await myIncuire(prompts_obj[question_list[i]]);
            sql_query_obj.push(res);
        }
    } else {
        //let question_list = [1, 2, 3];
        let question_list = ['table', 'filter_by_column', 'filter_by_value'];
        for (let i = 0; i < question_list.length; i++) {
            if (prompts_obj[question_list[i]][0].name === 'choice') {
                res_filter_by = sql_query_obj.filter(item => item.filter_by !== undefined)
                res_table = sql_query_obj.filter(item => item.table !== undefined)
                prompts_obj[question_list[i]][0].choices = await custom_query('SELECT ' + res_filter_by[0].filter_by + ' FROM ' + res_table[0].table);
            }
            res = await myIncuire(prompts_obj[question_list[i]]);
            sql_query_obj.push(res);
        }
    }
    sql_query(sql_query_obj);
    connection.end();
})();

const sql_query = async (data) => {
    switch (data[0].action) {
        case "INSERT":
            var query = `INSERT INTO ${data[1].table} (name) VALUES ("${data[2].update_value}")`;
            break;

        case "SELECT":
            var query = `SELECT * FROM ${data[1].table} WHERE ${data[2].filter_by} = '${data[3].choice}'`;
            break;

        case "UPDATE":
            var query = `UPDATE ${data[1].table} SET ${data[4].update_choice} = '${data[5].update_value}' WHERE ${data[2].filter_by} = '${data[3].choice}'`;
            break;

        case "DELETE":
            var query = `DELETE FROM ${data[1].table} WHERE ${data[2].filter_by} = '${data[3].choice}'`;
            break;
    }
    console.log(query)
    const answer = await custom_query(query, {})
    console.log(answer)

}


