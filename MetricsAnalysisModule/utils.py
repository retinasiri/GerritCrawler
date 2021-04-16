from progress.bar import ChargingBar
from humanfriendly import format_timespan


class SlowBar(ChargingBar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)
