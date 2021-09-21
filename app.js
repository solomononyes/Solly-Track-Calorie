// storage controller
const lsCtrl = (() => {
  //Public
  return {
    // Clear all item on ls
    clearLsItem: () => {
      localStorage.clear();
    },
    // Delete item from ls
    deleteItemFromLs: (id) => {
      if (localStorage.getItem("items") !== null) {
        items = JSON.parse(localStorage.getItem("items"));
        const newItems = items.filter((item) => item.id !== id);
        localStorage.setItem("items", JSON.stringify(newItems));
      }
    },
    //Get item from local storage
    getItemFromLS: () => {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    //Store item in local storage
    storeIteminLs: (item) => {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
      }
      localStorage.setItem("items", JSON.stringify(items));
    },
    // Update item on ls
    updatedLsItem: (items) => {
      localStorage.setItem("items", JSON.stringify(items));
    },
  };
})();

// item controller
const ItemCtrl = (() => {
  // itemCtrl constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure
  const data = {
    // items: [
    //   { id: 0, name: "Rice", calories: 30 },
    //   { id: 1, name: "Fish", calories: 7 },
    //   { id: 2, name: "Yam", calories: 50 },
    // ],
    items: lsCtrl.getItemFromLS(),
    currentItem: null,
    totalCalorie: 0,
  };
  //Public
  return {
    addItem: (name, calories) => {
      // Make list items visible
      document.querySelector(UICtrl.getSelector().itemList).style.display =
        "block";
      // search for the Id of the last item and add 1 to it
      let newId;
      if (data.items.length > 0) {
        newId = data.items[data.items.length - 1].id + 1;
      } else {
        newId = 0;
      }
      // Calories to number format
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(newId, name, calories);
      // Add new item to item array
      data.items.push(newItem);

      return newItem;
    },
    clearItem: () => {
      data.items = [];
    },
    deleteItem: (id) => {
      data.items = data.items.filter((item) => item.id !== id);
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getData: () => {
      return data.items;
    },
    getItemById: (id) => {
      let found;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    logData: () => {
      return data;
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    sumOfItemCalories: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      return total;
    },
    updatedItem: (name, calories) => {
      calories = parseInt(calories);
      let found;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
  };
})();

// UI controller
const UICtrl = (() => {
  UISelector = {
    addButton: ".add-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    deleteBtn: ".delete-btn",
    inputItemName: "#item-name",
    inputItemCalories: "#item-calories",
    itemList: "#item-list",
    listItems: "#item-list li",
    totalCalories: ".total-calories",
    updateBtn: ".update-btn",
  };
  //Public
  return {
    addItemToForm: () => {
      document.querySelector(UISelector.inputItemName).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.inputItemCalories).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    addListItem: (item) => {
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      //Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
      // Insert item
      document
        .querySelector(UISelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    clearInput: () => {
      document.querySelector(UISelector.inputItemName).value = "";
      document.querySelector(UISelector.inputItemCalories).value = "";
    },
    deleteListItem: (id) => {
      const selector = `#item-${id}`;
      const deleteItem = document.querySelector(selector);
      deleteItem.remove();
    },
    getInputItem: () => {
      return {
        name: document.querySelector(UISelector.inputItemName).value,
        calories: document.querySelector(UISelector.inputItemCalories).value,
      };
    },
    getSelector: () => {
      return UISelector;
    },
    handleBackClick: (e) => {
      UICtrl.hideEditState();
      e.preventDefault();
    },
    handleClearItemBtn: (e) => {
      UICtrl.removeUIList();
      //Or
      // document.querySelector(UISelector.itemList).innerHTML = "";

      // Hide empty list
      UICtrl.hideList();

      // Clear items in data.items
      ItemCtrl.clearItem();
      //Clear from local storage
      lsCtrl.clearLsItem();
      // Clear sum Calories
      UICtrl.showTotalCalories();
      e.preventDefault();
    },
    handleDeleteClick: (e) => {
      const currentItem = ItemCtrl.getCurrentItem();
      const itemID = currentItem.id;
      ItemCtrl.deleteItem(itemID);
      lsCtrl.deleteItemFromLs(itemID);
      UICtrl.deleteListItem(itemID);
      UICtrl.hideEditState();
      UICtrl.showTotalCalories();
      e.preventDefault();
    },
    hideEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelector.updateBtn).style.display = "none";
      document.querySelector(UISelector.deleteBtn).style.display = "none";
      document.querySelector(UISelector.backBtn).style.display = "none";
      document.querySelector(UISelector.addButton).style.display = "inline";
    },
    hideList: () => {
      document.querySelector(UISelector.itemList).style.display = "none";
    },
    populateItem: (items) => {
      let listHtml = "";
      items.forEach((item) => {
        listHtml += `
        <li id="item-${item.id}" class="collection-item" id="item-0">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
      </li>`;
        return listHtml;
      });
      // insert list item
      document.querySelector(UISelector.itemList).innerHTML = listHtml;
    },
    removeUIList: () => {
      let listItems = document.querySelectorAll(UISelector.listItems);
      listItems = Array.from(listItems);
      listItems.forEach((li) => {
        li.remove();
      });
    },
    showEditState: () => {
      document.querySelector(UISelector.updateBtn).style.display = "inline";
      document.querySelector(UISelector.deleteBtn).style.display = "inline";
      document.querySelector(UISelector.backBtn).style.display = "inline";
      document.querySelector(UISelector.addButton).style.display = "none";
    },
    showTotalCalories: () => {
      document.querySelector(UISelector.totalCalories).textContent =
        ItemCtrl.sumOfItemCalories();
    },
    submitUpdateItem: (e) => {
      const item = UICtrl.getInputItem();
      const updatedItem = ItemCtrl.updatedItem(item.name, item.calories);
      lsCtrl.updatedLsItem(updatedItem);
      UICtrl.updateListItem(updatedItem);
      UICtrl.hideEditState();
      UICtrl.showTotalCalories();
      e.preventDefault();
    },
    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UISelector.listItems);
      // convert Node list to array
      listItems = Array.from(listItems);

      listItems.forEach((li) => {
        // const itemID = li.getAttribute('id') OR li.id
        const itemID = li.id;
        if (itemID === `item-${item.id}`) {
          li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
  };
})();

// App controller
const App = (() => {
  // Load event listeners
  loadEventListener = () => {
    // Get UI selectors
    const UISelector = UICtrl.getSelector();
    // Add event listeners
    document
      .querySelector(UISelector.addButton)
      .addEventListener("click", AddItemsOnSubmit);
    // Disable submit button on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    // Update item
    document
      .querySelector(UISelector.updateBtn)
      .addEventListener("click", UICtrl.submitUpdateItem);
  };

  // Add items on submit
  AddItemsOnSubmit = (e) => {
    const inputItem = UICtrl.getInputItem();
    if (inputItem.name !== "" && inputItem.calories !== "") {
      const newItem = ItemCtrl.addItem(inputItem.name, inputItem.calories);
      UICtrl.addListItem(newItem);
      lsCtrl.storeIteminLs(newItem);
      UICtrl.clearInput();
      UICtrl.showTotalCalories();
    }
    e.preventDefault();
  };

  handleEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      const itemID = e.target.parentNode.parentNode.id;
      const idArray = itemID.split("-");
      const id = parseInt(idArray[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };
  // Click edit
  document
    .querySelector(UISelector.itemList)
    .addEventListener("click", handleEditClick);
  // Click back
  document
    .querySelector(UISelector.backBtn)
    .addEventListener("click", UICtrl.handleBackClick);
  //Delete item
  document
    .querySelector(UISelector.deleteBtn)
    .addEventListener("click", UICtrl.handleDeleteClick);
  // Clear all Item
  document
    .querySelector(UISelector.clearBtn)
    .addEventListener("click", UICtrl.handleClearItemBtn);
  //Public
  return {
    init: () => {
      UICtrl.hideEditState();
      const items = ItemCtrl.getData();
      // check if items is empty(to prevent the list line from displaying)
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate items using UICtrl
        UICtrl.populateItem(items);
      }

      UICtrl.showTotalCalories();
      loadEventListener();
    },
  };
})();

App.init();
