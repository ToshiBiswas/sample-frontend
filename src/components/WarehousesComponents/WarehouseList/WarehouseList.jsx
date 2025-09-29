import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronIcon, DeleteOutlineIcon, EditIcon, SortIcon, SearchIcon } from "../../Iconography/Iconography";
import "./WarehouseList.scss";
import WarehouseDelete from "../WarehouseDelete/WarehouseDelete";

const backendUrl = import.meta.env.VITE_API_URL;

function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
  const [deleteObj, setDeleteObj] = useState(null);
  const [displayWarehouses, setDisplayWarehouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch warehouses with sorting
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/warehouses`, {
          params: {
            sort_by: sortField || undefined,
            order_by: sortOrder,
          },
        });
        setWarehouses(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchWarehouses();
  }, [deleteObj, sortField, sortOrder]);

  // Reapply search filter whenever warehouses or search query changes
  useEffect(() => {
    applySearch();
  }, [warehouses, searchQuery]);

  const cancelDelete = () => {
    setDeleteObj(null);
  };

  // Updated search handler triggered on form submit.
  const handleSearch = (e) => {
    e.preventDefault();
    applySearch();
  };
  
  // Function that applies search filtering on the warehouses
  const applySearch = () => {
    // If search query is empty, show full list.
    if (searchQuery.trim() === '') {
      setDisplayWarehouses(warehouses);
      return;
    }

    // Build a case-insensitive regex for the search query.
    const regex = new RegExp(`(${searchQuery})`, "i");

    const filtered = warehouses.filter(warehouse => {
      const combinedString = `${warehouse.warehouse_name} ${warehouse.address} ${warehouse.city} ${warehouse.country} ${warehouse.contact_name} ${warehouse.contact_email}`;
      return regex.test(combinedString);
    });

    setDisplayWarehouses(filtered);
  };

  // Function to handle sort icon clicks on a column header
  const handleSort = (column) => {
    if (sortField === column) {
      // Toggle order if the same column is clicked again
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(column);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <div className="warelist">
        <div className="warelist__topbar">
          <h1>Warehouses</h1>
          <div className="warelist__topbar-actions">
            <form className="warelist__searchbar" onSubmit={handleSearch}>
              <input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="warelist__searchbar__submit" type="submit" >
                <SearchIcon />
              </button>
            </form>
            <Link className="warelist__add-warehouse" to={`/warehouses/add`}>
              + Add New Warehouse
            </Link>
          </div>
        </div>

        <div className="warelist__headers">
          <div className="warelist__headers-c1">
            <h4>Warehouse</h4>
            <div className="warelist__headers-c1_sort" onClick={() => handleSort("warehouse_name")}>
              <SortIcon />
            </div>
          </div>
          <div className="warelist__headers-c2">
            <h4>Address</h4>
            <div className="warelist__headers-c2_sort" onClick={() => handleSort("address")}>
              <SortIcon />
            </div>
          </div>
          <div className="warelist__headers-c3">
            <h4>Contact Name</h4>
            <div className="warelist__headers-c3_sort" onClick={() => handleSort("contact_name")}>
              <SortIcon />
            </div>
          </div>
          <div className="warelist__headers-c4">
            <h4>Contact Information</h4>
            <div className="warelist__headers-c4_sort" onClick={() => handleSort("contact_email")}>
              <SortIcon />
            </div>
          </div>
          <div className="warelist__headers-c5">
            <h4>Actions</h4>
          </div>
        </div>

        {displayWarehouses.map((warehouse, index) => (
          <div className={`warelist__list ${index === 0 ? "warelist__list--removeborder" : ""}`} key={warehouse.id}>
            <div className="warelist__list-c1">
              <div className="warelist__list-header">
                <h4>Warehouse</h4>
              </div>
              <div>
                <Link className="warelist__warehouse-link" to={`/warehouses/${warehouse.id}`}>
                  <h3>{warehouse.warehouse_name}</h3>
                  <ChevronIcon />
                </Link>
              </div>
            </div>
            <div className="warelist__list-c2">
              <div className="warelist__list-header">
                <h4>Address</h4>
              </div>
              <div>{warehouse.address}</div>
            </div>
            <div className="warelist__list-c3">
              <div className="warelist__list-header">
                <h4>Contact Name</h4>
              </div>
              <div>{warehouse.contact_name}</div>
            </div>
            <div className="warelist__list-c4">
              <div className="warelist__list-header">
                <h4>Contact Information</h4>
              </div>
              <div>
                {warehouse.contact_phone} <br /> {warehouse.contact_email}
              </div>
            </div>
            <div className="warelist__list-c5">
              <div style={{ color: "#c94515", cursor: "pointer" }} onClick={() => setDeleteObj({ id: warehouse.id, name: warehouse.warehouse_name, fun: () => setDeleteObj(null) })}>
                <DeleteOutlineIcon />
              </div>
              <Link to={`/warehouses/${warehouse.id}/edit`}>
                <div style={{ color: "#2e66e5" }}>
                  <EditIcon />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {deleteObj && <WarehouseDelete warehousedata={deleteObj} />}
    </>
  );
}

export default WarehouseList;
