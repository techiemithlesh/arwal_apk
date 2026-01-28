{/* <TouchableOpacity
                      style={styles.getLocationButton}
                      onPress={async () => {
                        const granted = await getLocationPermission();

                        if (!granted) {
                          Alert.alert(
                            'Location Required',
                            'Please allow location permission',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Open Settings',
                                onPress: openLocationSettings,
                              },
                            ],
                          );
                          return;
                        }

                        setLoadingLocation(true);

                        // STEP 1: Try cached location (FAST)
                        Geolocation.getCurrentPosition(
                          position => {
                            setLocation({
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                            });
                            setLoadingLocation(false);
                          },
                          () => {
                            // STEP 2: Fallback to high accuracy GPS
                            Geolocation.getCurrentPosition(
                              position => {
                                setLocation({
                                  latitude: position.coords.latitude,
                                  longitude: position.coords.longitude,
                                });
                                setLoadingLocation(false);
                              },
                              error => {
                                setLoadingLocation(false);

                                let message = 'Unable to fetch location';

                                if (error.code === 1) {
                                  message = 'Location permission denied';
                                } else if (error.code === 2) {
                                  message =
                                    'GPS is OFF. Please enable location services.';
                                } else if (error.code === 3) {
                                  message =
                                    'Location taking too long. Please move to open area and retry.';
                                }

                                Alert.alert('Location Error', message, [
                                  { text: 'Cancel', style: 'cancel' },
                                  {
                                    text: 'Open Settings',
                                    onPress: openLocationSettings,
                                  },
                                ]);
                              },
                              {
                                enableHighAccuracy: true,
                                timeout: 30000, // ⬅ increased
                                maximumAge: 0,
                                forceRequestLocation: true,
                                showLocationDialog: true,
                              },
                            );
                          },
                          {
                            enableHighAccuracy: false, // ⬅ cached
                            timeout: 5000,
                            maximumAge: 60000, // ⬅ allow old location
                          },
                        );
                      }}
                    >
                      <Text style={styles.getLocationButtonText}>
                        📍 Get Current Location
                      </Text>
                    </TouchableOpacity> */}