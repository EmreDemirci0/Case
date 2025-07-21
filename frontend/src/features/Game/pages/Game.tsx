function Game() {
    const cards = new Array(8).fill(null);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">
        {/* Header */}
        <div className="flex items-center justify-between px-2">
          <button className="text-blue-400">Cancel</button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">Your bot</h1>
            <p className="text-xs text-gray-400">bot</p>
          </div>
          <div className="w-6" />
        </div>
  
        {/* Energy bar */}
        <div className="mt-4 px-2">
          <div className="text-sm font-medium text-pink-400">Enerji</div>
          <div className="relative w-full h-5 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div className="absolute top-0 left-0 h-full bg-pink-500" style={{ width: '95%' }}></div>
            <div className="absolute w-full text-center text-xs text-white leading-5">
              %1 Yenilenmesine Kalan: 1:59
            </div>
          </div>
        </div>
  
        {/* Tabs */}
        <div className="flex gap-2 mt-4 px-2 overflow-x-auto">
          <button className="bg-yellow-300 text-black text-xs font-semibold rounded-full px-3 py-1">Tüm Seviyeler</button>
          <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Sv1</button>
          <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Sv2</button>
          <button className="bg-gray-800 text-white text-xs font-medium rounded-full px-3 py-1">Max Sv</button>
        </div>
  
        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 px-2">
          {cards.map((_, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-lg shadow-md">
              <div className="w-full h-28 bg-gray-700 rounded-md mb-2"></div> {/* Placeholder for image */}
              <div className="text-xs text-right text-white font-semibold mb-1">Seviye {idx === 6 ? 3 : idx === 7 ? 2 : 1}</div>
              <div className="text-sm font-bold text-white mb-1">Zümrüt Kehanet</div>
              <p className="text-xs text-gray-400 mb-2">Sade, keskin bir savaş kılıcı.</p>
  
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-pink-500 h-2.5 rounded-full"
                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                ></div>
              </div>
  
              {/* Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-pink-400 font-bold">5.00</div>
                <button
                  className={`text-xs font-medium px-3 py-1 rounded-full ${idx === 0 ? 'bg-pink-600' : 'bg-gray-700 text-white'}`}
                >
                  {idx === 0 ? 'Yükset' : 'Geliştir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Game;
  