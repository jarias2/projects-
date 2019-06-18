

function addEvent(object, evName, fnName, cap) {
   if (object.attachEvent)
       object.attachEvent("on" + evName, fnName);
   else if (object.addEventListener)
       object.addEventListener(evName, fnName, cap);
}

function addProps(object, text, tableRow) {

   object = {
      value: text,
      row: tableRow
   }

   return object;
}

function numCompare(a, b) {
   return b.value - a.value;
}

function alphaCompare(a, b) {
   var astring = a.value.toLowerCase();
   var bstring = b.value.toLowerCase();

   if (bstring > astring) return 1;
   if (bstring < astring) return -1;
   return 0;
}

function sortCol() {
   sortIndex = this.colIndex;
   runSort();
}

addEvent(window, "load", setupTable, false);

var sortTable;
var sortBody;
var sortHead;
var sortCols;
var sortDirection = "descending";
var sortIndex;

function setupTable() {
   sortTable = document.getElementById("qbstats");
   sortCols = sortTable.getElementsByTagName("col");
   sortBody = sortTable.tBodies[0];
   sortHead = sortTable.tHead;   

   for (var i = 0; i < sortHead.rows[0].cells.length; i++) {
      sortHead.rows[0].cells[i].onclick = sortCol;
      sortHead.rows[0].cells[i].style.cursor = "pointer";
      sortHead.rows[0].cells[i].colIndex = i;
   }

   addSortDirection();
}

function addSortDirection() {
   // Create sort direction selection list table row
   var newRow = document.createElement("tr");
   var newCell = document.createElement("th");
   newCell.innerHTML = "<label for='sortdir'>Sort Direction</label>";
   newCell.setAttribute("colSpan", sortCols.length);
   newCell.className = "sortHeader";

   // Create sort direction selection list
   var sortSelect = document.createElement("select");
   sortSelect.onchange = toggleSort;

   // Create selection list option buttons
   var optionDesc = document.createElement("option");
   optionDesc.innerHTML = "Descending";
   var optionAsc = document.createElement("option");
   optionAsc.innerHTML = "Ascending";
   
   // Append element nodes
   sortSelect.appendChild(optionDesc);
   sortSelect.appendChild(optionAsc);
   newCell.appendChild(sortSelect);
   newRow.appendChild(newCell);

   sortHead.insertBefore(newRow, sortHead.firstChild);
}

function toggleSort() {
   if (sortDirection == "descending") sortDirection = "ascending"
   else sortDirection = "descending";
   runSort();
}

function runSort() {
   var sortCells = new Array();

   for (var i = 0; i < sortBody.rows.length; i++) {
      var sortCell = sortBody.rows[i].cells[sortIndex];
      var celltxt = sortCell.innerText || sortCell.textContent;

      var regx = /(\,|\$)/g;
      celltxt = celltxt.replace(regx, "");

      sortCells[i] = addProps(sortCells[i], celltxt, sortBody.rows[i]);

   }

   var sortType = sortCols[sortIndex].className;
  
   // Determine wheter to sort alphabetically or numerically
   if (sortType == "asort") {
      sortCells = sortCells.sort(alphaCompare);
   } else if (sortType == "numsort") {
      sortCells = sortCells.sort(numCompare);
   }

   // Reverse the sorting order if sortDirection is ascending
   if (sortDirection == "ascending") sortCells.reverse();

   // Sort the rows by appending (moving) the row nodes
   for (var i = 0; i < sortCells.length; i++) {
      sortBody.appendChild(sortCells[i].row);
   }

   // Higlight the sorting column
   colorColumns();   
}

function colorColumns() {

   for (var i = 0; i < sortCols.length; i++) {
      sortCols[i].style.backgroundColor = "white";
   }

   sortCols[sortIndex].style.backgroundColor = "rgb(232, 255, 232)";
}

