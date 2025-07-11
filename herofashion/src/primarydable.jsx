// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';

// export default function Primary_table() {
//     const [loading, setLoading] = useState(false);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [customers, setCustomers] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [selectedCustomers, setSelectedCustomers] = useState([]);
//     const [lazyState, setLazyState] = useState({
//         first: 0,
//         rows: 10,
//         page: 1,
//         sortField: null,
//         sortOrder: null,
//         filters: {
//             name: { value: '', matchMode: 'contains' },
//             'country.name': { value: '', matchMode: 'contains' },
//             company: { value: '', matchMode: 'contains' },
//             'representative.name': { value: '', matchMode: 'contains' }
//         }
//     });

//     let networkTimeout = null;

//     useEffect(() => {
//         loadLazyData();
//         return () => clearTimeout(networkTimeout);
//     }, [lazyState]);

//     const loadLazyData = () => {
//         setLoading(true);
//         if (networkTimeout) clearTimeout(networkTimeout);

//         networkTimeout = setTimeout(() => {
//             fetch('http://10.1.21.13:7001/api/table-join-data', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ lazyEvent: lazyState })
//             })
//             .then(res => res.json())
//             .then(data => {
//                 setCustomers(data.customers || []);
//                 setTotalRecords(data.totalRecords || 0);
//                 setLoading(false);
//             })
//             .catch(() => setLoading(false));
//         }, Math.random() * 1000 + 250);
//     };

//     const onPage = (event) => setLazyState(event);
//     const onSort = (event) => setLazyState(event);
//     const onFilter = (event) => {
//         event.first = 0;
//         setLazyState(event);
//     };

//     const onSelectionChange = (event) => {
//         const value = event.value;
//         setSelectedCustomers(value);
//         setSelectAll(value.length === totalRecords);
//     };

//     const onSelectAllChange = async (event) => {
//         const checked = event.checked;
//         if (checked) {
//             try {
//                 const response = await fetch('http://10.1.21.13:7001/api/table-join-data', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ lazyEvent: { ...lazyState, first: 0, rows: totalRecords } })
//                 });
//                 const data = await response.json();
//                 setSelectAll(true);
//                 setSelectedCustomers(data.customers || []);
//             } catch (err) {
//                 console.error(err);
//             }
//         } else {
//             setSelectAll(false);
//             setSelectedCustomers([]);
//         }
//     };

//     const representativeBodyTemplate = (rowData) => (
//         <div className="flex align-items-center gap-2">
//             <img alt={rowData.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.representative.image}`} width={32} />
//             <span>{rowData.representative.name}</span>
//         </div>
//     );

//     const countryBodyTemplate = (rowData) => (
//         <div className="flex align-items-center gap-2">
//             <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//             <span>{rowData.country.name}</span>
//         </div>
//     );

//     return (
//         <div className="card">
//             <DataTable
//                 value={customers}
//                 lazy
//                 filterDisplay="row"
//                 dataKey="id"
//                 paginator
//                 first={lazyState.first}
//                 rows={10}
//                 totalRecords={totalRecords}
//                 onPage={onPage}
//                 onSort={onSort}
//                 sortField={lazyState.sortField}
//                 sortOrder={lazyState.sortOrder}
//                 onFilter={onFilter}
//                 filters={lazyState.filters}
//                 loading={loading}
//                 tableStyle={{ minWidth: '75rem' }}
//                 selection={selectedCustomers}
//                 onSelectionChange={onSelectionChange}
//                 selectAll={selectAll}
//                 onSelectAllChange={onSelectAllChange}
//             >
//                 <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
//                 <Column field="Jobno_Oms" header="Jobno_Oms" sortable filter filterPlaceholder="Search" />
//                 <Column field="country.name" sortable header="Country" filterField="country.name" body={countryBodyTemplate} filter filterPlaceholder="Search" />
//                 <Column field="company" sortable filter header="Company" filterPlaceholder="Search" />
//                 <Column field="representative.name" header="Representative" body={representativeBodyTemplate} filter filterPlaceholder="Search" />
//             </DataTable>
//         </div>
//     );
// }



import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Primary_table() {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {}
    });

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

   

    const loadLazyData = () => {
    setLoading(true);

    fetch('http://10.1.21.13:7001/api/table-join-data')
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text(); // read the plain error string
                throw new Error(text);
            }
            return res.json();
        })
        .then(data => {
            setData(data || []);
            setTotalRecords(data.length || 0);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Fetch error:", err.message);
            setLoading(false);
        });
};

    const imageTemplate = (rowData) => {
        return <img src={rowData["Image Order"]} alt="Order" style={{ width: '80px' }} />;
    };

    return (
        <div className="card">
            <DataTable value={data.slice(lazyState.first, lazyState.first + lazyState.rows)}
                       paginator rows={10} totalRecords={totalRecords} lazy
                       onPage={(e) => setLazyState({ ...lazyState, first: e.first })}
                       loading={loading} dataKey="OrderNo"
                       selection={selectedItems} onSelectionChange={(e) => setSelectedItems(e.value)}>

                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="OrderNo" header="Order No" sortable filter />
                <Column field="Company Name" header="Company" sortable filter />
                <Column field="FinalDelvDate" header="Final Delivery" sortable filter />
                <Column field="PODate" header="PO Date" sortable filter />
                <Column field="Quality Controller" header="Quality Controller" sortable filter />
                <Column field="Buyer_sh" header="Buyer" sortable filter />
                <Column field="Image Order" header="Image" body={imageTemplate} />
            </DataTable>
        </div>
    );
}
