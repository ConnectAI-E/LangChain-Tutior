import chalk from 'chalk';

export const info = (message?: any, ...optionalParams: any[]) => {
    console.log(chalk.blue(`[INFO] ${message}`), ...optionalParams);
};

export const warn = (message?: any, ...optionalParams: any[]) => {
    console.log(chalk.yellow(`[WARN] ${message}`), ...optionalParams);
};

export const error = (message?: any, ...optionalParams: any[]) => {
    console.log(chalk.red(`[ERROR] ${message}`), ...optionalParams);
};
