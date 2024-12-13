import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import { ILayerDoors } from '../../interfaces/map/zone.interface';
interface LayerDoorsProps {
    data:ILayerDoors[]
}
export const LayerDoors = ({data}:LayerDoorsProps) => {
  return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
            <table className="min-w-full table-auto bg-white">
                <thead>
                <tr className="bg-black text-white">
                    <th className="px-4 py-2 text-left">Puerta</th> 
                    <th className="px-4 py-2 text-right">#Núm. Inven.</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="border-b last:border-none hover:bg-gray-50">
                    <td className="px-4 py-2 flex">
                        <img src={row.icon} alt="" className="w-6" />
                        <SwipeRightAltIcon/>
                        <p className="px-3 bg-black text-white rounded-lg">{row.countDoors ?row.countDoors:0}</p>
                    </td>
                    <td className="px-4 py-2 text-right">{row.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
  )
}
