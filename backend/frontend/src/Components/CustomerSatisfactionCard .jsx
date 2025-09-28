const CustomerSatisfactionCard = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Satisfaction</h2>
      
      {/* Product Info */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-600 mb-1">Review Radar product rating</h3>
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl font-bold text-gray-900">{data.overall_rating}</span>
          <Star className="w-6 h-6 text-green-500 fill-current" />
          <span className="text-sm text-gray-600">based on {data.total_reviews} ratings</span>
        </div>
        <p className="text-xs text-gray-500">Ratings since {data.ratings_updated}</p>
        <p className="text-sm text-gray-700 mt-1">Top product: {data.overall_rating} stars</p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-8">
        {data.rating_distribution.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 w-12">{item.stars} stars</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-900 h-2 rounded-full transition-all duration-500" 
                style={{width: `${item.percentage}%`}}
              ></div>
            </div>
            <span className="text-sm text-gray-600 w-8">{item.count}</span>
            <MessageSquare className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};