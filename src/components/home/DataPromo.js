import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;

const DataPromo = ({ promotion, loading }) => {

    const columns = [
        { dataField: "barcode", text: "Barcode" },
        { dataField: "desc", text: "Nama Produk" },
        { dataField: "promo", text: "Potongan Harga" },
        { dataField: "period", text: "Periode" },
    ]

    if (loading) {
        return <h2>Mohon tunggu...</h2>
    }
    return (
        <ToolkitProvider
            bootstrap4
            keyField="barcode"
            data={promotion}
            columns={columns}
            search>
            {
                props => (
                    <div>
                        <div className="float-right">
                            <SearchBar {...props.searchProps} placeholder="Pencarian" />
                        </div>
                        <BootstrapTable
                            {...props.baseProps} pagination={paginationFactory()} wrapperClasses="table-sm"
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    )
}

export default DataPromo
