import pytest
from math import radians, sin, cos, sqrt, atan2
from app.services.location_service import haversine_distance, EARTH_RADIUS_KM


class TestHaversineDistance:
    def test_same_location(self):
        assert haversine_distance(9.0192, 38.7525, 9.0192, 38.7525) == 0.0

    def test_known_distance(self):
        dist = haversine_distance(0, 0, 0, 1)
        assert 110 < dist < 112

    def test_addis_to_nairobi(self):
        dist = haversine_distance(9.0192, 38.7525, -1.2921, 36.8219)
        assert 1100 < dist < 1200

    def test_north_pole_to_equator(self):
        dist = haversine_distance(90, 0, 0, 0)
        assert 9900 < dist < 10100

    def test_negative_coordinates(self):
        dist = haversine_distance(-33.8688, 151.2093, -37.8136, 144.9631)
        assert 700 < dist < 720

    def test_small_distance(self):
        dist = haversine_distance(9.0192, 38.7525, 9.0200, 38.7530)
        assert 0 < dist < 1
