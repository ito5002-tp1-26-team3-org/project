export const mockAlerts = [
  {
    id: "A-1001",
    type: "Battery fire risk",
    severity: "High",
    location: "Glen Eira",
    message: "Spike in battery-containing devices detected in kerbside waste.",
    time: "Today 10:15"
  },
  {
    id: "A-1002",
    type: "Improper disposal trend",
    severity: "Medium",
    location: "Yarra",
    message: "Misclassification rate increasing for small appliances.",
    time: "Yesterday 16:40"
  }
];

export const mockStats = {
  ewasteCollectedTonnes: 128.4,
  ewastePerCapitaKg: 6.2,
  recoveryRatePercent: 41,
  lgasAboveRiskThreshold: 3
};

export const mockLgas = ["Glen Eira", "Yarra", "Melbourne", "Monash", "Darebin"];
export const mockEWasteTypes = ["Batteries", "Phones", "Laptops", "Small appliances", "Mixed"];
