import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Constants from "expo-constants";
import { debounceCallback } from "@libs";
import { SelectedAddress } from "@types";

interface AddressSuggestion {
  description: string;
  place_id: string;
}

interface MapSearchBarProps {
  onSelect: (address: SelectedAddress) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [skipNextChange, setSkipNextChange] = useState(false);
  // Extract the API key from Expo manifest
  const googleApiKey =
    Constants.expoConfig?.android?.config?.googleMaps?.apiKey ||
    Constants.expoConfig?.ios?.config?.googleMapsApiKey ||
    Constants.expoConfig?.extra?.googleApiKey ||
    process.env.GOOGLE_MAPS_API_KEY ||
    "";
  const inputRef = useRef<TextInput>(null);
  const fetchSuggestions = useCallback(
    debounceCallback(async (input: string) => {
      if (!input) {
        setSuggestions([]);
        return;
      }
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input,
        )}&key=${googleApiKey}`;
        console.log("Fetching suggestions:", url, Constants.expoConfig);
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "OK") {
          setSuggestions(data.predictions);
        } else {
          console.warn("Places Autocomplete error:", data.status);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 500),
    [googleApiKey],
  );

  useEffect(() => {
    if (isFocused) {
      fetchSuggestions(query);
    }
  }, [query, isFocused, fetchSuggestions]);

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    try {
      console.log("Selected suggestion:", suggestion);
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&key=${googleApiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.result.geometry.location;
        onSelect({
          name: suggestion.description,
          latitude: lat,
          longitude: lng,
        });
        // Prevent onChangeText events from reacting to this programmatic update.
        setSkipNextChange(true);
        setQuery(suggestion.description);
        setSuggestions([]);
        setIsFocused(false);
        // Blur the text input to hide suggestions.
        inputRef.current?.blur();
        // Reset the flag after a short delay.
        setTimeout(() => setSkipNextChange(false), 600);
      } else {
        console.warn("Place Details error:", data.status);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const dismissSuggestions = () => {
    setIsFocused(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissSuggestions}>
      <View style={styles.container}>
        {isFocused && query.length > 0 && suggestions.length > 0 && (
          <FlatList
            style={styles.suggestionsList}
            data={suggestions}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  handleSelectSuggestion(item);
                }}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <TextInput
          ref={inputRef}
          style={styles.input}
          className="rounded-2xl"
          placeholder="Search address..."
          value={query}
          returnKeyType="done"
          onChangeText={(text) => {
            if (skipNextChange) return;
            setQuery(text);
          }}
          onFocus={handleFocus}
          onSubmitEditing={() => {
            // Dismiss the keyboard
            Keyboard.dismiss();
            // Optionally, update your state so that the suggestions disappear:
            setIsFocused(false);
            setSuggestions([]);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  suggestionsList: {
    backgroundColor: "white",
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default MapSearchBar;
