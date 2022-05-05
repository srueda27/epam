# epam BE project

Command line directory app

## Init

```
npm install
```

### Commands

```
CREATE 'folder_name'
```
```
MOVE 'folder_name' 'receptor_folder_name'
```
```
DELETE 'folder_name'
```
```
LIST
```

### Create/Delete a child folder

When creating or deleting or referring a child folder, the parent folder name must be given first followed by /

Example: 

  parent_folder
    child_folder

```
parent_folder/folder_name
```

CREATE parent_folder/second_child_folder 

The output would be:

  parent_folder
    child_folder
    second_child_folder

## How to run the app
```
node directories.js
```

## Run tests
```
npm run watch
```