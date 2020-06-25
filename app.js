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

let sqlOuery = {}

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
var prompts = require("./prompts");
(async () => {
    let res
    res = await myIncuire(prompts.action);
    sqlOuery = { ...sqlOuery, ...res }
    if (res.action === 'INSERT') {
        let question_list = ['table', 'update_value'];
        for (let i = 0; i < question_list.length; i++) {
            res = await myIncuire(prompts[question_list[i]]);
            sqlOuery = { ...sqlOuery, ...res }
        }
    } else if (res.action === 'UPDATE') {
        let question_list = ['table', 'filter_by_column', 'filter_by_value', 'update_column', 'update_value'];
        for (let i = 0; i < question_list.length; i++) {
            if (prompts[question_list[i]][0].name === 'choice') {
                prompts[question_list[i]][0].choices = await custom_query('SELECT ' + sqlOuery.filter_by + ' FROM ' + sqlOuery.table);
            }
            res = await myIncuire(prompts[question_list[i]]);
            sqlOuery = { ...sqlOuery, ...res }
        }
    } else {
        let question_list = ['table', 'filter_by_column', 'filter_by_value'];
        for (let i = 0; i < question_list.length; i++) {
            if (prompts[question_list[i]][0].name === 'choice') {
                prompts[question_list[i]][0].choices = await custom_query('SELECT ' + sqlOuery.filter_by + ' FROM ' + sqlOuery.table);
            }
            res = await myIncuire(prompts[question_list[i]]);
            sqlOuery = { ...sqlOuery, ...res }
        }
    }
    console.log(sqlOuery)
    sql_query(sqlOuery);
    connection.end();
})();

const sql_query = async (data) => {
    switch (data.action) {
        case "INSERT":
            var query = `INSERT INTO ${data.table} (name) VALUES ("${data.update_value}")`;
            break;

        case "SELECT":
            var query = `SELECT * FROM ${data.table} WHERE ${data.filter_by} = '${data.choice}'`;
            break;

        case "UPDATE":
            var query = `UPDATE ${data.table} SET ${data.update_choice} = '${data.update_value}' WHERE ${data.filter_by} = '${data.choice}'`;
            break;

        case "DELETE":
            var query = `DELETE FROM ${data.table} WHERE ${data.filter_by} = '${data.choice}'`;
            break;
    }
    console.log(query)
    const answer = await custom_query(query, {})
    console.log(answer)

}


