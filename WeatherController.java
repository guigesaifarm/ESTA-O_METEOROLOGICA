package com.campifitech.weather.controller;

import com.campifitech.weather.model.WeatherData;
import com.campifitech.weather.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") // Permite acesso do front-end
public class WeatherController {

    @Autowired
    private WeatherRepository weatherRepository;

    // Endpoint para o ESP32 ou LoRaWAN enviar os dados via POST
    @PostMapping("/ingest")
    public ResponseEntity<String> receiveSensorData(@RequestBody WeatherData data) {
        weatherRepository.save(data);
        return ResponseEntity.ok("Dados recebidos com sucesso!");
    }

    // Endpoint para o site buscar o último registro meteorológico
    @GetMapping("/latest")
    public ResponseEntity<WeatherData> getLatestData() {
        WeatherData latest = weatherRepository.findTopByOrderByIdDesc();
        if (latest == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(latest);
    }
}
