import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export const postSnippet: string =
`---
title: $\{2\}
date: YYYY
excerpt: $\{3\}
image: [$\{4\}]
tags: [$\{5\}]
---

$\{7\}`;

let insertFrontMatter: boolean = false;

export function
shouldInsertFrontMatter(): boolean {
  return insertFrontMatter;
}

export function
setFrontMatter(flag: boolean): void {
  insertFrontMatter = flag;
}

export async function
createFile(dirName: string, newFileName: string): Promise<string> {
  let folders = vscode.workspace.workspaceFolders;
  if (folders === undefined || dirName === null || dirName === undefined) {
    return newFileName;
  }
  const templateName = '.post-template';
  const templatePath = path.resolve(folders[0].uri.fsPath, templateName);
  const fileName = path.resolve(dirName, newFileName);
  const templateExists: boolean = templatePath !== undefined &&
                                  fs.existsSync(templatePath);
  const fileExists: boolean = fs.existsSync(fileName);
  const frontMatter = templateExists ? fs.readFileSync(templatePath) : '';
  setFrontMatter(!fileExists && !templateExists);
  if (!fileExists) {
    fs.appendFileSync(fileName, frontMatter);
  }
  return fileName;
}

export async function
openFile(fileName: string): Promise<vscode.TextEditor> {
  const stats = fs.statSync(fileName);

  if (stats.isDirectory()) {
    throw new Error("This file is a directory!");
  }

  const doc = await vscode.workspace.openTextDocument(fileName);
  if (!doc) {
    throw new Error('Could not open file!');
  }

  const editor = vscode.window.showTextDocument(doc);
  if (!editor) {
    throw new Error('Could not show document!');
  }
  return editor;
}

export async function
getFileNameFromUser(): Promise<string> {
  const defaultFileName = "new-post.md";
  let question = `What's the name of the new post?`;

  let filePath = await vscode.window.showInputBox({
    prompt: question,
    value: defaultFileName,
  });
  if (filePath === undefined) {
    return defaultFileName;
  }
  return filePath || defaultFileName;
}

export function
getDateTime(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const time = String(today.getHours()).padStart(2, '0') +
               ":" +
               String(today.getMinutes()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd + ' ' + time;
}

export function
addDateToFilename(fileName: string): string {
  if (fileName === null) {
    throw new Error('File name cannot be null');
  }
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd + '-' + fileName;
}
