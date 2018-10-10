//
//  Screenshot.swift
//  Screenshot
//
//  Created by Faisal Alquaddoomi on 10/6/18.
//  Copyright © 2018 ENIGMA. All rights reserved.
//

import XCTest

class Screenshot: XCTestCase {
  override class func setUp() {
    /*
    // here we'll launch the app, subscribe to a variant, then quit it
    let app = XCUIApplication()
    setupSnapshot(app)
    app.launch()
    
    // subscribe to c.956a>c, then quit
    if (app.otherElements["disclaimer-agree"].waitForExistence(timeout: 2)) {
      app.otherElements["disclaimer-agree"].tap()
    }
    
    app.otherElements["searchbox-textinput"].typeText("c.956a>c")
    
    app.terminate()
    */
  }
  
  override func setUp() {
    continueAfterFailure = false
    
    let app = XCUIApplication()
    setupSnapshot(app)
    app.launch()
    
    // see if we should dismiss the disclaimer before we do anything
    if (app.otherElements["disclaimer-agree"].waitForExistence(timeout: 2)) {
      app.otherElements["disclaimer-agree"].tap()
    }
  }
  
  override func tearDown() {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
  }
  
  func testSubscribing() {
    let app = XCUIApplication()
    let field = app.textFields.element(boundBy: 0)
    field.tap()
    field.typeText("c.956a>c\n")
    
    let resultsList = app.staticTexts["result-c.956A>C"]
    
    print(app.debugDescription)

    // wait for the search results, then select the first element
    if (!resultsList.waitForExistence(timeout: 5)) {
      print(resultsList.debugDescription)
      print("~~~~~")
      print(app.debugDescription)
      XCTFail()
    }

    resultsList.tap()
  }

  func testSnapHome() {
    snapshot("0Home")
  }
  
  func snapMenuScreen(buttonName:String, screenTitle:String) {
    let app = XCUIApplication()
    
    if (app.otherElements["home-searchbar"].waitForExistence(timeout: 10)) {
      app.navigationBars.buttons.element(boundBy: 0).tap()
      app.otherElements[buttonName].tap()
      snapshot("0" + screenTitle)
    }
    else {
      XCTFail();
    }
  }
  
  func testSnapSearch() {
    snapMenuScreen(buttonName: "search", screenTitle: "Search")
  }
  
  func testSnapFollowing() {
    snapMenuScreen(buttonName: "following", screenTitle: "Following")
  }
  
  func testSnapNotifyLog() {
    snapMenuScreen(buttonName: "notify-log", screenTitle: "NotifyLog")
  }
  
  func testSnapAbout() {
    snapMenuScreen(buttonName: "about", screenTitle: "About")
  }
  
  func testSnapUserGuide() {
    snapMenuScreen(buttonName: "user-guide", screenTitle: "UserGuide")
  }
}
