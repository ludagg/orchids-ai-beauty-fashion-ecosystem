import os
import json

def audit_directory(path="src"):
    result = {}
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                result[os.path.join(root, file)] = "unknown"
    return result

if __name__ == "__main__":
    print(json.dumps(audit_directory(), indent=2))
