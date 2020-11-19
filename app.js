const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { Console } = require("console");

const teamArr = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function buildTeam() {

    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                name: "name",
                type: "input",
                message: "Please enter the employee's first and last name: ",
            },
            {
                name: "role",
                type: "list",
                message: "What role does this employee fill?",
                choices: ["Intern", "Engineer", "Manager"]
            },
            {
                name: "id",
                type: "input",
                message: "Enter employee ID: ",
            },
            {
                name: "email",
                type: "input",
                message: "Enter employee email address: ",
            },
            {
                name: "internSchool",
                type: "input",
                message: "Intern's university?",
                when: function (answers) {
                    // Only run if user answered Intern as Role
                    return answers.role === "Intern";
                }
            },
            {
                name: "engineerGithub",
                type: "input",
                message: "Enter employee's GitHub URL: ",
                when: function (answers) {
                    // Only run if user answered Engineer as Role
                    return answers.role === "Engineer";
                }
            },
            {
                name: "managerOfficeNumber",
                type: "input",
                message: "Enter manager's office number: ",
                when: function (answers) {
                    // Only run if user answered Manager as Role
                    return answers.role === "Manager";
                }
            },
            {
                name: "isMoreEmployees",
                type: "list",
                message: "Would you like to add another employee?",
                choices: [
                    {
                        name: "Yes",
                        value: true
                    },
                    {
                        name: "No",
                        value: false
                    }
                ]
            }
        ])
        .then(answers => {

            switch (answers.role) {
                case "Manager":
                    const newManager = new Manager(answers.name, answers.id, answers.email, answers.managerOfficeNumber)
                    teamArr.push(newManager);
                    break;
                case "Engineer":
                    const newEngineer = new Engineer(answers.name, answers.id, answers.email, answers.engineerGithub)
                    teamArr.push(newEngineer);
                    break;
                case "Intern":
                    const newIntern = new Intern(answers.name, answers.id, answers.email, answers.internSchool)
                    teamArr.push(newIntern);
                    break;
            }

            console.log(teamArr);

            if (answers.isMoreEmployees) {
                buildTeam();
            } else {

                // Render HTML
                const renderedHtml = render(teamArr);

                // Write File
                fs.writeFile("./output/team.html", renderedHtml, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Success! ");
                })
            }

        })
}

buildTeam();