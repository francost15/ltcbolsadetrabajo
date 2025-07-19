interface MatchInfoProps {
  match: number;
  analisis?: string | null;
  areas_mejora?: string[] | null;
  habilidades_match?: any;
  showDetails?: boolean;
}

export function MatchInfo({ match, analisis, areas_mejora, habilidades_match, showDetails = false }: MatchInfoProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getMatchTextColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-700";
    if (percentage >= 70) return "text-blue-700";
    if (percentage >= 60) return "text-yellow-700";
    return "text-gray-700";
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100";
    if (percentage >= 70) return "bg-blue-100";
    if (percentage >= 60) return "bg-yellow-100";
    return "bg-gray-100";
  };

  return (
    <div className="space-y-2">
      {/* Porcentaje de match */}
      <div className="flex items-center gap-2">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getMatchBgColor(match)} ${getMatchTextColor(match)}`}>
          <div className={`w-2 h-2 rounded-full ${getMatchColor(match)} mr-1.5`}></div>
          {match}% Match
        </div>
        {match >= 80 && (
          <span className="text-green-600 text-xs font-medium">🎯 Excelente match</span>
        )}
        {match >= 70 && match < 80 && (
          <span className="text-blue-600 text-xs font-medium">✨ Buen match</span>
        )}
        {match >= 60 && match < 70 && (
          <span className="text-yellow-600 text-xs font-medium">⚡ Match parcial</span>
        )}
      </div>

      {/* Información detallada */}
      {showDetails && (
        <>
          {analisis && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-1">📊 Análisis de compatibilidad</h4>
              <p className="text-sm text-gray-700">{analisis}</p>
            </div>
          )}

          {areas_mejora && areas_mejora.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">🚀 Áreas de mejora</h4>
              <ul className="space-y-1">
                {areas_mejora.map((area, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start">
                    <span className="text-blue-600 mr-1">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {habilidades_match && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">✅ Habilidades que coinciden</h4>
              <div className="text-sm text-green-800">
                {typeof habilidades_match === 'string' ? (
                  <p>{habilidades_match}</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(habilidades_match, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 