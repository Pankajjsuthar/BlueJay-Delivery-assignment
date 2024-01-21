# BlueJay Delivery Assignment

## Introduction

This program is designed to analyze a given Excel file containing employee timecard data and identify specific patterns related to employee working hours. The analysis includes finding employees who:

1. Worked for 7 consecutive days.
2. Have less than 10 hours of time between shifts but greater than 1 hour.
3. Worked for more than 14 hours in a single shift.

## Requirements

- [Node.js](https://nodejs.org/) installed on your machine.
- Excel file named "Assignment_Timecard.xlsx" in the same directory as the script.

## How to Run

1. **Clone the repository:**

    ```bash
    git clone [repository_link]
    ```

2. **Navigate to the project directory:**

    ```bash
    cd [project_directory]
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the script:**

    ```bash
    node index.js
    ```

5. **Check the console output for the identified employees and review the `output.txt` file in the project directory.**

## Code Structure

- **index.js**: The main script file that performs the analysis on the Excel data.
- **output.txt**: Contains the console output of the program.

## Assumptions

- The Excel file is named "Assignment_Timecard.xlsx" and is in the same directory as the script.
- The program assumes that the input Excel file is well-structured with relevant data in specific columns.

## Comments

- The code is organized into functions to improve readability and maintainability.
- Meaningful variable and function names have been used to enhance code understanding.
- Code comments are provided to explain the purpose and functionality of key sections.

## Edge Cases

- The program considers edge cases such as missing or invalid data in the Excel file.
- Time calculations take into account different date formats and handle them appropriately.

## Contact Information

For any questions or concerns, please contact Pankaj Suthar at psuthar27302@gmail.com 
