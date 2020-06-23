var inquirer = require("inquirer");
//var mysql = require("mysql");
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
        choices: ['Employee', 'Department', 'Role'],
        name: "table"
    }
]);
choice_list.push([
    {
        type: "list",
        message: "With?",
        choices: ['Name', 'Role'],
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

    for (let i = 0; i < choice_list_length ; i++) {
        if (choice_list[i][0].name === 'choice') {
            choice_list[i][0].choices = ['Otherthing1', '2']
            choice_list.push([
                {
                    type: "input",
                    message: "Set value to?",
                    name: "update_value2"
                }
            ]);
            choice_list_length = choice_list.length;

        } 
        
        let res = await myIncuire(choice_list[i]);
        console.log(res);
        sql_query_obj.push(res);
    }
    console.log(sql_query_obj);
    sql_query(sql_query_obj);
})();

const sql_query = (data) => {
    console.log(`${data[0].action} * FROM ${data[1].table} WHERE ${data[2].filter_by} = ${data[3].choice}`);


}


