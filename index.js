const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
}
   
const request = indexedDB.open("CarsDatabase", 1);


request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
};


request.onupgradeneeded = function () {
    //1
    const db = request.result;
  
    //2
    const store = db.createObjectStore("cars", { keyPath: "id" });
  
    //3
    store.createIndex("cars_colour", ["colour"], { unique: false });
  
    // 4
    store.createIndex("colour_and_make", ["colour", "make"], {
      unique: false,
    }); 
};


request.onsuccess = function () {
    console.log("Database opened successfully");
  
    const db = request.result;
  
    // 1
    const transaction = db.transaction("cars", "readwrite");
  
    //2
    const store = transaction.objectStore("cars");
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");
  
    //3
    store.put({ id: 1, colour: "Red", make: "Toyota" });
    store.put({ id: 2, colour: "Red", make: "Kia" });
    store.put({ id: 3, colour: "Blue", make: "Honda" });
    store.put({ id: 4, colour: "Silver", make: "Subaru" });
    store.put({ id: 5, colour: "Maroon", make: "Tesla" });
    store.put({ id: 6, colour: "White", make: "BMW" });
    store.put({ id: 7, colour: "Black", make: "BMW" });
  
  
    //4
    const idQuery = store.get(4);
    const colourQuery = colourIndex.getAll(["Red"]);
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);
  
    // 5
    idQuery.onsuccess = function () {
      console.log('idQuery', idQuery.result);
    };
    colourQuery.onsuccess = function () {
      console.log('colourQuery', colourQuery.result);
    };
    colourMakeQuery.onsuccess = function () {
      console.log('colourMakeQuery', colourMakeQuery.result);
    };

    //update
     const bmw = store.get(6);

     bmw.onsuccess= function () {
     bmw.result.colour = "Green";
     store.put(bmw.result);
     }

    //delete
    const deleteCar = store.delete(7);

    deleteCar.onsuccess = function () {
    console.log("Red BMW has been removed");
    };
  
    // 6
    transaction.oncomplete = function () {
      db.close();
    };
};
  