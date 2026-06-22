from django.test import SimpleTestCase
from django.urls import resolve, Resolver404


class MovieEndpointUrlTests(SimpleTestCase):
    def test_currently_playing_endpoint_resolves_under_api_movies_prefix(self):
        resolved = resolve('/api/movies/currently-playing/')
        self.assertEqual(resolved.view_name, 'movie-currently-playing')
