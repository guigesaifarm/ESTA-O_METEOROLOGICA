package com.campifitech.weather.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private double windSpeed;
    private String windDirection;
    private double airTemp;
    private double airHumidity;
    private double soilTemp;
    private double soilHumidity;
    private double gasLevel;
    
    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters e Setters
    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    public String getWindDirection() { return windDirection; }
    public void setWindDirection(String windDirection) { this.windDirection = windDirection; }
    public double getAirTemp() { return airTemp; }
    public void setAirTemp(double airTemp) { this.airTemp = airTemp; }
    public double getAirHumidity() { return airHumidity; }
    public void setAirHumidity(double airHumidity) { this.airHumidity = airHumidity; }
    public double getSoilTemp() { return soilTemp; }
    public void setSoilTemp(double soilTemp) { this.soilTemp = soilTemp; }
    public double getSoilHumidity() { return soilHumidity; }
    public void setSoilHumidity(double soilHumidity) { this.soilHumidity = soilHumidity; }
    public double getGasLevel() { return gasLevel; }
    public void setGasLevel(double gasLevel) { this.gasLevel = gasLevel; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
