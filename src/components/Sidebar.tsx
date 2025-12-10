import { useAppDispatch } from '../store/hooks'
import { addWidget, WidgetType } from '../store/slices/widgetSlice'

const Sidebar = () => {
  const dispatch = useAppDispatch()

  const handleAddWidget = (type: WidgetType) => {
    dispatch(addWidget(type))
  }

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-400">Add Widget</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleAddWidget('weather')}
              className="w-full text-left px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              + Weather
            </button>
            <button
              onClick={() => handleAddWidget('crypto')}
              className="w-full text-left px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              + Crypto Price
            </button>
            <button
              onClick={() => handleAddWidget('tasks')}
              className="w-full text-left px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              + Task List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

