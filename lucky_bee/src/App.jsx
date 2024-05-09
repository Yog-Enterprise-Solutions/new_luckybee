import { FrappeApp } from "frappe-js-sdk";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const getSiteName = () => {
    if (
      window.frappe?.boot?.versions?.frappe &&
      (window.frappe.boot.versions.frappe.startsWith("15") ||
        window.frappe.boot.versions.frappe.startsWith("16"))
    ) {
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME;
    }
    return import.meta.env.VITE_SITE_NAME;
  };

  const frappeUrl = getSiteName();
  // const frappeUrl = "http://194.31.55.40:15000/";

  var frappe = new FrappeApp(frappeUrl);
  const db = frappe.db();
  const auth = frappe.auth();

  auth
    .loginWithUsernamePassword({ username: "administrator", password: "admin" })
    .then((response) => console.log("Logged in"))
    .catch((error) => console.error(error));

  // State variables
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [Brand, setBrand] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [filteredbrand, setFilteredbrand] = useState([]);
  const [filteredgroup, setFilteredgroup] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showbrandDropdown, setShowbrandDropdown] = useState(false);
  const [showgroupDroupdown, setshowgroupDroupdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [itemList1, setItemList1] = useState();
  const [itemList2, setItemList2] = useState();
  const [itemList3, setItemList3] = useState();
  const [itemDetails, setitemDetails] = useState();
  const [searchBrand, setSearchBrand] = useState("");
  const [searchGroup, setsearchGroup] = useState("");
  const [Brandlist, setBrandlist] = useState([]);
  const [Itemgroup, setItemgroup] = useState([]);

  const [countbrand, setcountbrand] = useState(0);

  // Fetch purchase invoices from the database
  const [countitem, setcountitem] = useState(0);
  useEffect(() => {
    if (countitem === 0) {
      db.getDocList("Item", {
        fields: ["item_name", "name"],
      })
        .then((docList) => {
          const items = docList.map((doc) => ({
            item_name: doc.item_name,
            name: doc.name,
          }));
          setPurchaseInvoices(items);
        })
        .catch((error) => console.error(error));

      setcountitem(1);
    }
  }, [countitem, db]);

  // Fetch group names //
  const [countgroup, setcountgroup] = useState(0);
  useEffect(() => {
    if (countgroup === 0) {
      db.getDocList("Item Group")
        .then((doc) => {
          setItemgroup(doc.map((group) => group.name));
        })
        .catch((error) => console.error(error));
      setcountgroup(1);
    }
  }, [countgroup, db]);

  // fetch brand names //
  useEffect(() => {
    if (countbrand === 0) {
      db.getDocList("Brand")
        .then((doc) => {
          setBrandlist(doc.map((brand) => brand.name));
        })
        .catch((error) => console.error(error));
      setcountbrand(1);
    }
  }, [countbrand, db]);

  // Update itemList1, itemList2, and itemList3 when searchValue changes
  useEffect(() => {
    if (purchaseInvoices.map((item) => item.item_name).includes(searchValue)) {
      setItemList1(
        purchaseInvoices.map((item) => item.item_name).indexOf(searchValue)
      );
      setItemList2(purchaseInvoices[itemList1]);
      if (itemList2) {
        setItemList3(itemList2.name);
      }
    }
  });

  // Event handler for input change
  const handleInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowDropdown(value.length > 0);
    if (value.length === 1) {
      setFilteredItemList([]);
    }

    const filteredItems = purchaseInvoices.filter((item) =>
      item.item_name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredItemList(filteredItems);
  };
  // handle input for brand //
  const handleInput1 = (e) => {
    const value = e.target.value;
    setSearchBrand(value);
    setShowbrandDropdown(value.length > 0);
    if (value.length === 1) {
      setFilteredbrand([]);
    }
    const filteredbrand = Brandlist.filter((brand) =>
      brand.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredbrand(filteredbrand);
  };

  // handle input for group //
  const handleInput2 = (e) => {
    const value = e.target.value;
    setsearchGroup(value);
    setshowgroupDroupdown(value.length > 0);
    if (value.length === 1) {
      setFilteredgroup([]);
    }
    const filteredgroup = Itemgroup.filter((group) =>
      group.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredgroup(filteredgroup);
  };

  const handleItemClick = (itemname, itemvalue) => {
    setSearchValue(itemname);
    setShowDropdown(false);
  };

  // handle brand click //
  const handlebrandClick = (brand) => {
    setSearchBrand(brand);
    setShowbrandDropdown(false);
  };

  // handle group click //
  const handlegroupClick = (group) => {
    setsearchGroup(group);
    setshowgroupDroupdown(false);
  };

  const handleInputFocus = (e) => {
    const value = e.target.value;
    if (!value) {
      setShowDropdown(true);
      setFilteredItemList(purchaseInvoices);
    }
  };
  // handleiput for brand //
  const handleInputFocus1 = (e) => {
    const value = e.target.value;
    if (!value) {
      setShowbrandDropdown(true);
      setFilteredbrand(Brandlist);
    }
  };
  // handleiput for group //
  const handleInputFocus2 = (e) => {
    const value = e.target.value;
    if (!value) {
      setshowgroupDroupdown(true);
      setFilteredgroup(Itemgroup);
    }
  };
  // Event handler for search button click
  const searchclick = () => {
    const inputValue = document.querySelector("#dataname").value.toLowerCase();
    const itemNames = purchaseInvoices.map((invoice) =>
      invoice.item_name.toLowerCase()
    );

    if (inputValue !== "" && itemNames.includes(inputValue)) {
      document.querySelector(".mgs").style.display = "none";
      document.querySelector(".searchdetails").style.display = "block";
      console.log("item3", itemList3);
      db.getDoc("Item", itemList3)
        .then((doc) => {
          console.log("Fetched document:", doc);
          if (doc) {
            setitemDetails(doc);
          } else {
            console.error("Document not found.");
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert("select a proper field");
    }
  };

  useEffect(() => {
    const tempBrandList = [];
    for (let i = 0; i < Brand.length; i++) {
      tempBrandList.push(Brand[i].name);
    }
    setBrandlist(tempBrandList);
  }, [Brand]);

  const [newname, setnewname] = useState("");

  const changename = (e) => {
    const newValue = e.target.value;
    setitemDetails((prevDetails) => ({
      ...prevDetails,
      item_name: newValue,
    }));
  };

  const [newcode, setnewcode] = useState("");

  const changecode = (e) => {
    const newValue = e.target.value;
    setitemDetails((prevDetails) => ({
      ...prevDetails,
      item_code: newValue,
    }));
  };
  const [newgroup, setnewgroup] = useState("");

  const changegroup = (e) => {
    const newValue = e.target.value;
    setitemDetails((prevDetails) => ({
      ...prevDetails,
      item_group: newValue,
    }));
  };

  const [newdescription, setnewdescription] = useState("");
  const changedescription = (e) => {
    const newValue = e.target.value;
    setitemDetails((prevDetails) => ({
      ...prevDetails,
      description: newValue,
    }));
  };

  const addbrand = () => {
    document.querySelector(".addbrandname").style.display = "block";
    document.querySelector(".detailbox").style.display = "none";
    document.querySelector("#search").style.display = "none";
  };

  const btncloseclick = () => {
    document.querySelector(".addbrandname").style.display = "none";
    document.querySelector(".detailbox").style.display = "block";
    document.querySelector("#search").style.display = "flex";
    setcountbrand(0);
  };

  const [newrate, setnewrate] = useState("");
  const changerate = (e) => {
    const newValue = e.target.value;
    setitemDetails((prevDetails) => ({
      ...prevDetails,
      last_purchase_rate: newValue,
    }));
  };

  const [updatebrand, setupdatebrand] = useState(false);
  useEffect(() => {
    if (updatebrand) {
      db.createDoc("Brand", {
        brand: document.querySelector(".newbrand").value,
      })
        .then((doc) => console.log(doc))
        .catch((error) => console.error(error));
    }
  }, [updatebrand]);

  const btnclick = () => {
    setupdatebrand(true);
    const newBrand = document.querySelector(".newbrand").value;
    if (newBrand !== "") {
      db.createDoc("Brand", {
        brand: newBrand,
      })
        .then((doc) => {
          console.log(doc);
          setBrandlist((prevBrandList) => [...prevBrandList, newBrand]); // Update Brandlist state
          document.querySelector(".addbrandname").style.display = "none";
          document.querySelector(".detailbox").style.display = "block";
          document.querySelector("#search").style.display = "flex";
        })
        .catch((error) => console.error(error));
    } else {
      alert("Create a Brand or enter Close");
    }
  };

  const [updateDataTrigger, setUpdateDataTrigger] = useState(false);

  useEffect(() => {
    if (updateDataTrigger) {
      db.updateDoc("Item", itemList3, {
        item_name: document.querySelector(".itemname").value,
        item_code: document.querySelector(".code").value,
        item_group: document.querySelector(".group").value,
        brand: document.querySelector("#brandnames").value,
        description: document.querySelector(".description").value,
        last_purchase_rate: document.querySelector(".Rate").value,
      })
        .then((docList) => {
          console.log("update", docList);
        })
        .catch((error) => console.error(error));
    }
  }, [updateDataTrigger]);

  const updatedata = () => {
    setUpdateDataTrigger(true);
  };

  return (
    <>
      <div
        className="container"
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div
          className="search-btn-container"
          id="search"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            width: "100vw",
            height: "5vh",
            position: "relative",
            top: "0px",
          }}
        >
          <div className="left-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              color="green"
              className="bi bi-search"
              viewBox="0 0 16 16"
              cursor="pointer"
              onClick={searchclick}
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </div>
          <div className="container">
            <input
              className="form-control"
              list="purchaseInvoices"
              id="dataname"
              placeholder="Search..."
              style={{ width: "100%", height: "28px" }}
              value={searchValue}
              onChange={handleInput}
              onFocus={handleInputFocus}
            />
            {/* Add dropdown here */}
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  transform: "translateX(-50%, -50%)",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ul className="suggestions">
                  {filteredItemList.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleItemClick(item.item_name, item.name)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {item.item_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="left-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              color="green"
              className="bi bi-arrow-clockwise"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
              />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
          </div>
        </div>
        <div className="display" style={{ width: "100%", height: "95vh" }}>
          <div
            className="mgs"
            style={{
              width: "100%",
              height: "60%",
              display: "block",
              position: "relative",
              transform: "translate(-50%, -50%)",
              top: "50%",
              left: "70%",
            }}
          >
            <h1>Nothing To Show</h1>
            <p>Search Item to get data</p>
          </div>
          <div
            className="searchdetails"
            style={{
              width: "100%",
              height: "100%",
              display: "none",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div className="detailbox">
              <div className="imgcontant">
                {itemDetails && itemDetails.image && (
                  <img
                    className="imgae"
                    src={itemDetails.image}
                    alt={itemDetails.name}
                  />
                )}
              </div>
              <div className="otherdetails">
                <div>
                  <h3 className="namehead">Item Name</h3>
                  {itemDetails && (
                    <input
                      className="itemname"
                      value={itemDetails.item_name}
                      onChange={changename}
                    />
                  )}
                </div>
                <div className="itemcode">
                  <h3>Item Code</h3>
                  {itemDetails && (
                    <input
                      className="code"
                      value={itemDetails.item_code}
                      onChange={changecode}
                    />
                  )}
                </div>
                <div className="itemgroup">
                  <h3>Item Group</h3>
                  {itemDetails && (
                    <input
                      className="group"
                      list="Grouplist"
                      placeholder="Select a group"
                      style={{ width: "91%", height: "40px" }}
                      value={searchGroup}
                      onChange={handleInput2}
                      onFocus={handleInputFocus2}
                    />
                  )}
                  {showgroupDroupdown && (
                    <div
                      style={{
                        position: "relative",
                        transform: "translateX(-50%, -50%)",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <ul className="ullist">
                        {filteredgroup.map((group) => (
                          <li
                            key={group}
                            onClick={() => handlegroupClick(group)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ccc",
                            }}
                          >
                            {group}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="brands">
                  <h3>Brands</h3>
                  {itemDetails && (
                    <input
                      list="brandList"
                      id="brandnames"
                      placeholder="Select a brand"
                      style={{ width: "91%", height: "40px" }}
                      value={searchBrand}
                      onChange={handleInput1}
                      onFocus={handleInputFocus1}
                    />
                  )}
                  {showbrandDropdown && (
                    <div
                      style={{
                        position: "relative",
                        transform: "translateX(-50%, -50%)",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <ul className="ullist">
                        <li style={{ borderBottom: "1px solid #d4d4d4" }}>
                          <button
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "8px",
                            }}
                            onClick={addbrand}
                          >
                            Add Brand
                          </button>
                        </li>
                        {filteredbrand.map((brand) => (
                          <li
                            key={brand}
                            onClick={() => handlebrandClick(brand)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid #ccc",
                            }}
                          >
                            {brand}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="itemdescription">
                  <h3>Item description</h3>
                  {itemDetails && (
                    <input
                      className="description"
                      value={itemDetails.description}
                      onChange={changedescription}
                    />
                  )}
                </div>
                <div className="rate">
                  <h3>Rate</h3>
                  {itemDetails && (
                    <input
                      type="number"
                      className="Rate"
                      value={itemDetails.last_purchase_rate}
                      onChange={changerate}
                    />
                  )}
                </div>
                <button onClick={updatedata} className="update">
                  Update
                </button>
              </div>
            </div>
            <div
              className="addbrandname"
              style={{
                display: "none",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid black",
                padding: "10px",
                borderRadius: "15px",
                gap: "12px",
                position: "relative",
                transform: "translate(-50% , -50%)",
                top: "50%",
                left: "44%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid black",
                  marginBottom: "10px",
                  width: "100%",
                }}
              >
                <h1>Create a New Brand</h1>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid black",
                  marginBottom: "10px",
                  width: "100%",
                }}
              >
                <input
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid black",
                    marginBottom: "10px",
                    width: "100%",
                    borderRadius: "20px",
                    padding: "5px",
                  }}
                  type="text"
                  placeholder="Enter a Brand Name"
                  className="newbrand"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={btnclick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid black",
                    marginBottom: "10px",
                    width: "49%",
                    borderRadius: "20px",
                    padding: "5px",
                    backgroundColor: "#71ca71",
                  }}
                >
                  Add
                </button>
                <button
                  onClick={btncloseclick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid black",
                    marginBottom: "10px",
                    width: "49%",
                    borderRadius: "20px",
                    padding: "5px",
                    backgroundColor: "rgb(224 78 78)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
