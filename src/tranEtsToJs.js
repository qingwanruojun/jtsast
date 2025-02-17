
import * as fs from "fs"; 
import * as path from "path"; 
import * as childProcess from "child_process";

export function tranEtsToJs(_in_file) {
  const directoryPath = _in_file; 
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
  
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
  
      // 检查文件是否为.ets文件
      if (path.extname(filePath) === '.ets') {
        // 构建.ts与.js文件的新路径
        const tsFilePath = filePath.slice(0, -4) + '.ts';
        const jsFilePath = filePath.slice(0, -4) + '.js';
  
        // 将.ets文件内容复制到.ts文件
        fs.readFile(filePath, 'utf8', (readError, data) => {
          if (readError) {
            console.error(`Failed to read file: ${filePath}: ${readError}`);
          } else {
            fs.writeFile(tsFilePath, data, 'utf8', (writeError) => {
              if (writeError) {
                console.error(`Failed to write .ts file: ${tsFilePath}: ${writeError}`);
              } else {
                console.log(`File ${filePath} content copied to ${tsFilePath}`);
  
                // 使用TypeScript编译器将.ts文件编译为.js文件
                const tscCommand = `tsc ${tsFilePath}`;
                childProcess.exec(tscCommand, (compileError, stdout, stderr) => {
                  if (compileError) {
                    console.error(`Failed to compile TypeScript file: ${tsFilePath}: ${compileError}`);
                  } else {
                    console.log(`File ${tsFilePath} has been compiled to ${jsFilePath}`);
                  }
                });
              }
            });
          }
        });
      }
    });
  });
  
}
