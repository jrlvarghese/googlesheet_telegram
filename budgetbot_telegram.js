/*
If paste this link in browser following response about the bot will get
https://api.telegram.org/bot5973063242:AAF5F_BYjfCKJDptew7f4X_JF13bBG6sovg/getMe
{"ok":true,"result":{"id":5973063242,"is_bot":true,"first_name":"Spreadsheet bot","username":"jrl_sheet_bot","can_join_groups":true,"can_read_all_group_messages":false,"supports_inline_queries":false}} 

below codes are developed using following tutorial in youtube
https://www.youtube.com/watch?v=pbTmjm2QKzk&list=PLGGHwNnXfci86dfqIVLc5l391SPk-RX1F&index=3
*/

// token for the telegram bot
var token = "paste_token";
// telegram bot url
var url = "https://api.telegram.org/bot" + token;
// web app url
var webAppUrl = "paste_webapp_url, you will get this url while trying to deploy";





// spreadsheet id for the target sheet
sheetId = "paste_sheetId";

function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());  
}

function getUpdate(){
  var response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

function setWebhook(){
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function doGet(e){
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

function sendText(id,text){
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + text);
  Logger.log(responser.getContentText());
}

function insertRowData(sheet_name, data){
  var my_sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheet_name);
  var data_length = data.length;
  my_sheet.insertRowBefore(2);
  my_sheet.getRange(2,1,1,data_length).setValues([data]);
}

// function sendText(id,text, keyBoard){
//   var data = {
//     method:’post’,
//     payload: {method:’sendMessage’,chat_id:String(id),text:text, parse_mode:’HTML’,reply_markup: JSON.stringify(keyBoard)
// }
// };
// UrlFetchApp.fetch(telegramUrl+’/’,data);
// }

function sendTextToTelegram(id, text, keyBoard){
  var text = "hello";
  var keyBoard = {
    "inline_keyboard":[
      [{"text":"Expenses", "callback_data":"expenses"}],
      [{"text":"Income", "callback_data":"income"}]]
  };
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(690988845),
      text: text,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch(url + '/', data);
}

function doPost(e){
  // GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),"Telegram update", JSON.stringify(e,null,4));
  var contents = JSON.parse(e.postData.contents);
  var text = contents.message.text;
  var id = contents.message.from.id;
  var chat_id = contents.message.chat.id;
  var name = contents.message.from.first_name;
  var afterSplit = text.split("/");
  var item = afterSplit[0];
  var amount = afterSplit[1];
  var category = afterSplit[2];
  var payment_method = afterSplit[3]
  if(afterSplit.length >= 2){
    if(category != null){
      category = category.toUpperCase();
    }
    if(payment_method != null){
      payment_method = payment_method.toUpperCase();
    }
    // structured data to be inserted
    var data = [new Date(), id, name, item, amount, "valid", category, payment_method, chat_id];
    // insert data using the function insertRowData
    insertRowData('entry',data);
    // generate a message for appropriate chat_id
    var message_text = generateTextMessage(chat_id); 
    // send message to the chat
    sendText(chat_id,message_text);
  }else{
    // structured data to be inserted
    var data = [new Date(), id, name, item, amount, "invalid", category, payment_method, chat_id];
    // insert data using the function insertRowData
    insertRowData('entry',data);
    sendText(chat_id,"Your input is not structured. Input as item/amount/category/payment mode");
  }
  //sendText(id,"Hello world");

}

function getSheetValue(sheetName, cellName){
  var daily_spend = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName).getRange(cellName).getValue();
  // Logger.log(daily_spend);
  return daily_spend;
}

// function to generate a text that could display message containing details of spends based on chat id
function generateTextMessage(chat_id){
  var messageText = "Today's spend by ";
    // if it's telegram group send all details %0A makes a new line
    if(chat_id == -1001668686599){
      var daily_spend = getSheetValue('name','E4');
      messageText += '%0A name: ';
      messageText += daily_spend;
      var daily_spend = getSheetValue('name','E4');
      messageText += '%0A name: ';
      messageText += daily_spend;

    }else if(chat_id==userid){// if message is from ajoy's id
      var daily_spend = getSheetValue('name','E4');
      messageText += '%0A Name: ';
      messageText += daily_spend;
    }else if(chat_id==userid){// if message is from jeril's id
      var daily_spend = getSheetValue('name1','E4');
      messageText += '%0A_name: ';
      messageText += daily_spend;
    }
    return messageText;
}

function cellValidationTest(){
  var test_sheet = SpreadsheetApp.openById(sheetId).getSheetByName('entry');
  var cat_sheet = SpreadsheetApp.openById(sheetId).getSheetByName('category');
  var cat_range = cat_sheet.getRange('A1:A6');
  // var test_range = test_sheet.getRange();
  var validation_range = test_sheet.getRange('H2:H1000');
  var validation_rule = SpreadsheetApp.newDataValidation().requireValueInRange(cat_range).setAllowInvalid(false).setHelpText("error").build();
  validation_range.setDataValidation(validation_rule);

}

// function test(){
//   var text_in = "Rent /23000";
//   var after_split = text_in.split("/");
//   Logger.log("Array length: " + after_split.length);
// }

// function test(){}
//   SpreadsheetApp.openById(sheetId).appendRow([1,2,3,5]);
// }
