export enum EventType {
  APP_NOTIFICATION = "app:notification",               // fired when emit a notification event

  APP_SELECT_CONTEXT = "app:select-context",           // fired when emit a context selection event
  APP_CHANGE_CONTEXT = "app:change-context",           // fired when emit a context change event

  APP_SELECT_ORGANIZATION = "app:select-organization", // fired when emit a organization selection event
  APP_ADD_ORGANIZATION= "app:add-organization",        // fired when emit a organization add event
  APP_EDIT_ORGANIZATION = "app:edit-organization",     // fired when emit a organization edit event
  APP_DELETE_ORGANIZATION = "app:delete-organization", // fired when emit a organization delete event
  
  APP_SELECT_PROJECT = "app:select-project",           // fired when emit a project selection event
  APP_ADD_PROJECT = "app:add-project",                 // fired when emit a project add event
  APP_EDIT_PROJECT = "app:edit-project",               // fired when emit a project edit event
  APP_DELETE_PROJECT = "app:delete-project",           // fired when emit a project delete event

  APP_SELECT_CASE = "app:select-case",                 // fired when emit a case selection event
  APP_ADD_CASE = "app:add-case",                       // fired when emit a case add event
  APP_EDIT_CASE = "app:edit-case",                     // fired when emit a case edit event
  APP_DELETE_CASE = "app:delete-case",                 // fired when emit a case delete event
}