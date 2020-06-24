var inquirer = require("inquirer");

var mysql = require("mysql");
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
        message: "What would you like to?",
        choices: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'],
        name: "action"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "Which Table?",
        choices: ['employee', 'department', 'role'],
        name: "table"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "With?",
        choices: ['name', 'department', 'role'],
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

(async () => {

    let choice_list_length = 4;

    for (let i = 0; i < choice_list_length; i++) {
        if (choice_list[i][0].name === 'choice') {
            //choice_list[i][0].choices = ['Paul', 'Bob']
            choice_list[i][0].choices = await custom_query('SELECT name FROM employee');
            // choice_list.push([
            //     {
            //         type: "input",
            //         message: "Set value to?",
            //         name: "update_value2"
            //     }
            // ]);
            // choice_list_length = choice_list.length;

        }

        let res = await myIncuire(choice_list[i]);
        console.log(res);
        sql_query_obj.push(res);
    }
    console.log(sql_query_obj);
    sql_query(sql_query_obj);
    connection.end();
})();

const util = require('util');

// node native promisify
const custom_query = util.promisify(connection.query).bind(connection);

const sql_query = async (data) => {
    console.log(`${data[0].action} * FROM ${data[1].table} WHERE ${data[2].filter_by} = ${data[3].choice}`);

    switch (data[0].action) {
        case "INSERT":
            var query = `INSERT position, song, year FROM ${data[1].table} WHERE ?`;
            break;

        case "SELECT":
            var query = `SELECT * FROM ${data[1].table} WHERE ${data[2].filter_by} = '${data[3].choice}'`;
            break;

        case "UPDATE":
            var query = "SELECT position, song, year FROM top5000 WHERE ?";
            break;

        case "DELETE":
            var query = `DELETE FROM ${data[1].table} WHERE ${data[2].filter_by} = '${data[3].choice}'`;
            break;
    }
    const answer = await custom_query(query)
    console.log(answer)

}


