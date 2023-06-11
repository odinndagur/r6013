import { useState } from 'react'
import { Header } from './Header'
import { query } from '../db'
import './RawSql.css'
import { Footer } from './Footer'

export function RawSql() {
    const [sqlString, setSqlString] = useState('')
    const [results, setResults] = useState([])
    function submitSql(ev) {
        ev.preventDefault()
        query(sqlString).then((res) => {
            setResults(res)
        })
    }
    return (
        <div>
            <Header>
                <form onSubmit={(ev) => submitSql(ev)}>
                    <textarea
                        onChange={(ev) => setSqlString(ev.target.value)}
                    ></textarea>
                    <button type="submit">Senda</button>
                </form>
            </Header>
            {results.length && (
                <table className="boostrap4_table_head_dark_striped">
                    <tr>
                        {Object.keys(results[0]).map((key) => {
                            return <th>{key}</th>
                        })}
                    </tr>
                    {results.map((result) => {
                        return (
                            <tr>
                                {Object.keys(result).map((key) => {
                                    return <td>{result[key]}</td>
                                })}
                                {/* Object.keys(result).map((key) => {
                                return <td>{result[key]}</td>
                            }) */}
                            </tr>
                        )
                    })}
                </table>
            )}
            <Footer/>
        </div>
    )
}
