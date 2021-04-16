from progress.bar import ChargingBar
from humanfriendly import format_timespan
from progress.spinner import Spinner
from git import RemoteProgress

class SlowBar(ChargingBar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'
    @property
    def remaining_hours(self):
        return format_timespan(self.eta)

class ProgressSpinner(Spinner):
    suffix = '%(message)s'
    def setSuffix(self, message):
        return message

class CloneProgress(RemoteProgress):
    def __init__(self):
        self.spinner = ProgressSpinner('Clonning ... ')

    def update(self, op_code, cur_count, max_count=None, message=''):
        if message:
            self.spinner.next()
            msg = (cur_count / (max_count or 100.0)) + "% | " + message
            self.spinner.setSuffix(msg)
            self.spinner.next()
            print((cur_count / (max_count or 100.0)) + " | " + message)

