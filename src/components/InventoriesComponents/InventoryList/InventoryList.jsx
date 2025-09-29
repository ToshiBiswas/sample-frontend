import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ChevronIcon,
  DeleteOutlineIcon,
  EditIcon,
  SortIcon,
  SearchIcon,
} from "../../Iconography/Iconography";
import "./InventoryList.scss";
import InventoryItemDelete from "../InventoryItemDelete/InventoryItemDelete";

const backendUrl = import.meta.env.VITE_API_URL;

function InventoryList() {
  const [inventories, setInventories] = useState([]);
  const [displayInventories, setDisplayInventories] = useState([]);
  const [deleteObj, setDeleteObj] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // State for sorting
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchInventories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/inventories`);
      setInventories(response.data);
      setDisplayInventories(response.data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [deleteObj]);

  // useed to load after edit (refresh component) to show the item immediately
  useEffect(() => {
    fetchInventories();
  }, []);

  // Re-sort the displayInventories array when sortField or sortOrder changes
  useEffect(() => {
    let sorted = [...displayInventories];
    if (sortField) {
      sorted.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        // If values are numbers, sort numerically.
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        // Otherwise, sort as case-insensitive strings.
        aVal = aVal ? aVal.toString().toLowerCase() : "";
        bVal = bVal ? bVal.toString().toLowerCase() : "";
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
      setDisplayInventories(sorted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortOrder]);
  useEffect(() => {
    applySearch();
  }, [inventories, searchQuery]);
  const cancelDelete = () => {
    setDeleteObj(null);
  };
  const applySearch = () => {
    // If the search query is empty, reset the display list.
    if (searchQuery.trim() === "") {
      setDisplayInventories(inventories);
      return;
    }

    // Create a regex for case-insensitive matching.
    const regex = new RegExp(`(${searchQuery})`, "i");

    // Filter inventories based on combined fields.
    const filtered = inventories.filter((inventory) => {
      const combinedString = `${inventory.item_name} ${inventory.category} ${inventory.status} ${inventory.quantity} ${inventory.warehouse_name}`;
      return regex.test(combinedString);
    });

    setDisplayInventories(filtered);
  };
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload

    // If the search query is empty, reset the display list.
    if (searchQuery.trim() === "") {
      setDisplayInventories(inventories);
      return;
    }

    // Create a regex for case-insensitive matching.
    const regex = new RegExp(`(${searchQuery})`, "i");

    // Filter inventories based on combined fields.
    const filtered = inventories.filter((inventory) => {
      const combinedString = `${inventory.item_name} ${inventory.category} ${inventory.status} ${inventory.quantity} ${inventory.warehouse_name}`;
      return regex.test(combinedString);
    });

    setDisplayInventories(filtered);
  };

  // Handle sort icon clicks.
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <div className="invelist">
        <div className="invelist__topbar">
          <h1>Inventory</h1>
          <div className="invelist__topbar-actions">
            <form className="invelist__searchbar" onSubmit={handleSearch}>
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="invelist__searchbar__submit" type="submit">
                <SearchIcon />
              </button>
            </form>
            <Link className="invelist__add-inventory" to={`/inventories/add`}>
              + Add New Item
            </Link>
          </div>
        </div>

        <div className="invelist__headers">
          <div className="invelist__headers-c1">
            <h4>Inventory Item</h4>
            <div
              className="invelist__headers-c1__sort"
              onClick={() => handleSort("item_name")}
            >
              <SortIcon />
            </div>
          </div>
          <div className="invelist__headers-c2">
            <h4>Category</h4>
            <div
              className="invelist__headers-c2__sort"
              onClick={() => handleSort("category")}
            >
              <SortIcon />
            </div>
          </div>
          <div className="invelist__headers-c3">
            <h4>Status</h4>
            <div
              className="invelist__headers-c3__sort"
              onClick={() => handleSort("status")}
            >
              <SortIcon />
            </div>
          </div>
          <div className="invelist__headers-c4">
            <h4>QTY</h4>
            <div
              className="invelist__headers-c4__sort"
              onClick={() => handleSort("quantity")}
            >
              <SortIcon />
            </div>
          </div>
          <div className="invelist__headers-c5">
            <h4>Warehouse</h4>
            <div
              className="invelist__headers-c5__sort"
              onClick={() => handleSort("warehouse_name")}
            >
              <SortIcon />
            </div>
          </div>
          <div className="invelist__headers-c6">
            <h4>Actions</h4>
          </div>
        </div>
        {displayInventories.map((inventory, index) => (
          <div
            className={`invelist__list ${
              index === 0 ? "invelist__list--removeborder" : ""
            }`}
            key={inventory.id}
          >
            <div className="invelist__list-c1">
              <div className="invelist__list-header">
                <h4>Inventory Item</h4>
              </div>
              <div>
                <Link
                  className="invelist__inventory-link"
                  to={`/inventories/${inventory.id}`}
                >
                  <h3>{inventory.item_name}</h3>
                  <ChevronIcon />
                </Link>
              </div>
            </div>
            <div className="invelist__list-c2">
              <div className="invelist__list-header">
                <h4>Category</h4>
              </div>
              <div>{inventory.category}</div>
            </div>
            <div className="invelist__list-c3">
              <div className="invelist__list-header">
                <h4>Status</h4>
              </div>
              <div
                className={`invelist__list-tag ${
                  inventory.status === "In Stock"
                    ? "invelist__list-tag--in"
                    : "invelist__list-tag--out"
                }`}
              >
                <h4>{inventory.status}</h4>
              </div>
            </div>
            <div className="invelist__list-c4">
              <div className="invelist__list-header">
                <h4>QTY</h4>
              </div>
              <div>{inventory.quantity}</div>
            </div>
            <div className="invelist__list-c5">
              <div className="invelist__list-header">
                <h4>Warehouse</h4>
              </div>
              <div>{inventory.warehouse_name}</div>
            </div>
            <div className="invelist__list-c6">
              <div
                style={{ color: "#c94515", cursor: "pointer" }}
                onClick={() =>
                  setDeleteObj({
                    id: inventory.id,
                    name: inventory.item_name,
                    fun: cancelDelete,
                  })
                }
              >
                <DeleteOutlineIcon />
              </div>
              <Link to={`/inventories/${inventory.id}/edit`}>
                <div style={{ color: "#2e66e5" }}>
                  <EditIcon />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {deleteObj && <InventoryItemDelete itemdata={deleteObj} />}
    </>
  );
}

export default InventoryList;
