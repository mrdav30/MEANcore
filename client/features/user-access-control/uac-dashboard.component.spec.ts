import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Role, Permission, User, Feature } from './index';
import { DashboardState } from './enums/uac-dashboard-state.enum';
import { UserAccessControlService } from './services/user-access-control.service';
import { UserAccessControlComponent } from './uac-dashboard.component';

describe('UserAccessControlComponent', () => {
  let component: UserAccessControlComponent;
  let fixture: ComponentFixture<UserAccessControlComponent>;

  const mockRole: Role = {
    _id: '0',
    name: 'test',
    features: [{
      _id: '0',
      name: 'test',
      route: '/test',
      permissions: [{
        _id: '0',
        perm_id: '0',
        name: 'test'
      }]
    }],
    users: [{
      _id: '0',
      name: 'tester',
      displayName: 'tester-user',
      email: 'test@test.com'
    }]
  };
  const newRole: Role = {
    _id: '1',
    name: 'test2',
    features: [{
      _id: '0',
      name: 'test',
      route: '/test',
      permissions: [{
        _id: '0',
        perm_id: '0',
        name: 'test'
      }]
    }],
    users: [{
      _id: '0',
      name: 'tester',
      displayName: 'tester-user',
      email: 'test@test.com'
    }]
  };
  const mockUser: User = {
    _id: '0',
    name: 'tester',
    displayName: 'tester-user',
    email: 'test@test.com'
  };
  const mockFeature: Feature = {
    _id: '0',
    name: 'test',
    route: '/test',
    permissions: [{
      _id: '0',
      perm_id: '0',
      name: 'test'
    }]
  };
  const newFeature: Feature = {
    _id: '1',
    name: 'test2',
    route: '/test2',
    permissions: [{
      _id: '1',
      perm_id: '1',
      name: 'test'
    }]
  };
  const mockPermission: Permission = {
    _id: '0',
    perm_id: '0',
    name: 'test'
  };
  const newPermission: Permission = {
    _id: '1',
    perm_id: '1',
    name: 'test2'
  };

  beforeEach(
    async(() => {
      const userAccessControlServiceStub = {
        getViewModel: () => ({ then: () => ({}) }),
        createRole: () => ({ then: () => ({ catch: () => ({}) }) }),
        updateRole: () => ({ then: () => ({ catch: () => ({}) }) }),
        deleteRole: () => ({ then: () => ({ catch: () => ({}) }) }),
        createFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
        updateFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
        deleteFeature: () => ({ then: () => ({ catch: () => ({}) }) }),
        createPermission: () => ({ then: () => ({ catch: () => ({}) }) }),
        modifyPermission: () => ({ then: () => ({ catch: () => ({}) }) }),
        deletePermission: () => ({ then: () => ({ catch: () => ({}) }) }),
        connectRoleWithPermission: () => ({
          then: () => ({ catch: () => ({}) })
        }),
        disconnectRoleFromPermission: () => ({
          then: () => ({ catch: () => ({}) })
        }),
        addUserToRole: () => ({ then: () => ({ catch: () => ({}) }) }),
        removeUserFromRole: () => ({ then: () => ({ catch: () => ({}) }) })
      };

      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [UserAccessControlComponent],
        providers: [
          {
            provide: UserAccessControlService,
            useValue: userAccessControlServiceStub
          }
        ]
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessControlComponent);
    component = fixture.debugElement.componentInstance;

    component.features.push(mockFeature);
    component.selectedFeature = mockFeature;
    component.roles.push(mockRole);
    component.selectedRole = mockRole;
    component.users.push(mockUser);

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', fakeAsync(() => {
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setMetaData');
      spyOn(userAccessControlServiceStub, 'getViewModel').and.returnValue(Promise.resolve({
        roles: mockRole,
        features: mockFeature,
        users: mockUser
      }));
      component.ngOnInit();
      tick();
      expect(userAccessControlServiceStub.getViewModel).toHaveBeenCalled();
      expect(component.setMetaData).toHaveBeenCalled();
    }));
  });
  it('dashState defaults to: DashboardState.ShowingRoles', () => {
    expect(component.dashState).toEqual(DashboardState.ShowingRoles);
  });
  it('featuresSelected defaults to: false', () => {
    expect(component.featuresSelected).toEqual(false);
  });
  it('usersSelected defaults to: false', () => {
    expect(component.usersSelected).toEqual(false);
  });
  it('rolesMetadata defaults to: []', () => {
    expect(component.rolesMetadata).toEqual([]);
  });
  it('featuresMetadata defaults to: []', () => {
    expect(component.featuresMetadata).toEqual([]);
  });
  it('usersMetadata defaults to: []', () => {
    expect(component.usersMetadata).toEqual([]);
  });
  it('usersReadOnlyMetadata defaults to: []', () => {
    expect(component.usersReadOnlyMetadata).toEqual([]);
  });
  it('permissionsMetadata defaults to: []', () => {
    expect(component.permissionsMetadata).toEqual([]);
  });
  describe('Roles', () => {
    describe('onToggleRole', () => {
      it('makes expected calls', () => {
        spyOn(component, 'setState');
        component.onToggleRole(mockRole);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreateRole', () => {
      it('does not add existing role', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createRole').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateRole(mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
      it('creates a role', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createRole').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateRole(newRole);
        expect(userAccessControlServiceStub.createRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createRole').and.returnValue(Promise.reject('Failed to create role'));
        component.onCreateRole(newRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyRole', () => {
      it('modifies a role', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'updateRole').and.returnValue(Promise.resolve());
        component.onModifyRole(mockRole);
        expect(userAccessControlServiceStub.updateRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'updateRole').and.returnValue(Promise.reject('Failed to modify role'));
        component.onModifyRole(mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeleteRole', () => {
      it('deletes a role', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setState');
        spyOn(userAccessControlServiceStub, 'deleteRole').and.returnValue(Promise.resolve());
        component.onDeleteRole(mockRole);
        tick();
        expect(component.setState).toHaveBeenCalled();
        expect(userAccessControlServiceStub.deleteRole).toHaveBeenCalled();
      }));
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deleteRole').and.returnValue(Promise.reject('Failed to delete role'));
        component.onDeleteRole(mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onAddUserToRole', () => {
      it('does not add existing user', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'addUserToRole').and.returnValue(Promise.resolve());
        component.onAddUserToRole(mockUser, mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
      it('adds user to role', () => {
        const newUser = {
          _id: '1',
          name: 'tester',
          displayName: 'tester-user',
          email: 'test@test.com'
        };
        component.users.push(newUser);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'addUserToRole').and.returnValue(Promise.resolve());
        component.onAddUserToRole(newUser, mockRole);
        expect(userAccessControlServiceStub.addUserToRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const newUser = {
          _id: '2',
          name: 'tester',
          displayName: 'tester-user',
          email: 'test@test.com'
        };
        component.users.push(newUser);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'addUserToRole').and.returnValue(Promise.reject('Failed to add user to role'));
        component.onAddUserToRole(newUser, mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onRemoveUserFromRole', () => {
      it('removes user from role', () => {
        const newUser = {
          _id: '1',
          name: 'tester',
          displayName: 'tester-user',
          email: 'test@test.com'
        };
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'removeUserFromRole').and.returnValue(Promise.resolve());
        component.onRemoveUserFromRole(newUser, mockRole);
        expect(userAccessControlServiceStub.removeUserFromRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'removeUserFromRole').and.returnValue(Promise.reject('Failed to remove user to role'));
        component.onRemoveUserFromRole(mockUser, mockRole);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
  });
  describe('Features', () => {
    describe('toggleFeature', () => {
      it('makes expected calls', () => {
        spyOn(component, 'setState');
        component.toggleFeature(mockFeature);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreateFeature', () => {
      it('does not add existing feature', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createFeature').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateFeature(mockFeature);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
      it('creates a feature', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createFeature').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateFeature(newFeature);
        expect(userAccessControlServiceStub.createFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createFeature').and.returnValue(Promise.reject('Failed to create feature'));
        component.onCreateFeature(newFeature);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyFeature', () => {
      it('modifies a feature', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'updateFeature').and.returnValue(Promise.resolve());
        component.onModifyFeature(mockFeature);
        expect(userAccessControlServiceStub.updateFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'updateFeature').and.returnValue(Promise.reject('Failed to modify feature'));
        component.onModifyFeature(mockFeature);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeleteFeature', () => {
      it('deletes a feature', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'deleteFeature').and.returnValue(Promise.resolve());
        component.onDeleteFeature(mockFeature);
        expect(userAccessControlServiceStub.deleteFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deleteFeature').and.returnValue(Promise.reject('Failed to delete feature'));
        component.onDeleteFeature(mockFeature);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
  });
  describe('Permissions', () => {
    beforeEach(() => {
      // rest the selectedFeature since tests don't run in order
      component.selectedFeature = mockFeature;
      component.selectedFeature.permissions.length = 0;
      component.selectedFeature.permissions.push(mockPermission);

      fixture.detectChanges();
    });

    describe('onTogglePermission', () => {
      it('makes expected calls', () => {
        spyOn(component, 'setState');
        component.onTogglePermission(mockPermission);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreatePermission', () => {
      it('does not add existing permission', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createPermission').and.returnValue(Promise.resolve({ perm_id: 0 }));
        component.onCreatePermission(mockPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
      it('creates a permission', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createPermission').and.returnValue(Promise.resolve({ perm_id: 1 }));
        component.onCreatePermission(newPermission);
        expect(userAccessControlServiceStub.createPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createPermission').and.returnValue(Promise.reject('Failed to create permission'));
        component.onCreatePermission(newPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyPermission', () => {
      it('modifies a permission', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'modifyPermission').and.returnValue(Promise.resolve());
        component.onModifyPermission(mockPermission);
        expect(userAccessControlServiceStub.modifyPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'modifyPermission').and.returnValue(Promise.reject('Failed to modify permission'));
        component.onModifyPermission(mockPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeletePermission', () => {
      it('deletes a permission', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setState');
        spyOn(userAccessControlServiceStub, 'deletePermission').and.returnValue(Promise.resolve());
        component.onDeletePermission(mockPermission);
        tick();
        expect(component.setState).toHaveBeenCalled();
        expect(userAccessControlServiceStub.deletePermission).toHaveBeenCalled();
      }));
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deletePermission').and.returnValue(Promise.reject('Failed to delete permission'));
        component.onDeletePermission(mockPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onAddPermissionToRole', () => {
      it('adds permission to role', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'connectRoleWithPermission').and.returnValue(Promise.resolve());
        component.onAddPermissionToRole(mockPermission);
        expect(userAccessControlServiceStub.connectRoleWithPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'connectRoleWithPermission')
          .and.returnValue(Promise.reject('Failed to add permission to role'));
        component.onAddPermissionToRole(mockPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onRemovePermissionFromRole', () => {
      it('removes permission from role', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'disconnectRoleFromPermission').and.returnValue(Promise.resolve());
        component.onRemovePermissionFromRole(mockPermission);
        expect(userAccessControlServiceStub.disconnectRoleFromPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'disconnectRoleFromPermission')
          .and.returnValue(Promise.reject('Failed to remove permission to role'));
        component.onRemovePermissionFromRole(mockPermission);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
  });
});
