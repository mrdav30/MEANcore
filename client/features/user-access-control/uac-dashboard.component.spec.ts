import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Role, Permission, User, Feature } from './index';
import { DashboardState } from './enums/uac-dashboard-state.enum';
import { UserAccessControlService } from './services/user-access-control.service';
import { UserAccessControlComponent } from './uac-dashboard.component';

describe('UserAccessControlComponent', () => {
  let component: UserAccessControlComponent;
  let fixture: ComponentFixture<UserAccessControlComponent>;

  beforeEach(
    async(() => {
      const roleStub = { users: {} };
      const permissionStub = { perm_id: {}, name: {} };
      const userStub = { _id: {} };
      const featureStub = {};
      const dashboardStateStub = {};
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
          { provide: Role, useValue: roleStub },
          { provide: Permission, useValue: permissionStub },
          { provide: User, useValue: userStub },
          { provide: Feature, useValue: featureStub },
          { provide: DashboardState, useValue: dashboardStateStub },
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

    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
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
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        spyOn(component, 'setState');
        component.onToggleRole(roleStub);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreateRole', () => {
      it('creates a role', () => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createRole').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateRole(roleStub);
        expect(userAccessControlServiceStub.createRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createRole').and.returnValue(Promise.reject('Failed to create role'));
        component.onCreateRole(roleStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyRole', () => {
      it('modifies a role', () => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'updateRole').and.returnValue(Promise.resolve());
        component.onModifyRole(roleStub);
        expect(userAccessControlServiceStub.updateRole).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'updateRole').and.returnValue(Promise.reject('Failed to modify role'));
        component.onModifyRole(roleStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeleteRole', () => {
      it('deletes a role', fakeAsync(() => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setState');
        spyOn(userAccessControlServiceStub, 'deleteRole').and.returnValue(Promise.resolve());
        component.onDeleteRole(roleStub);
        tick();
        expect(component.setState).toHaveBeenCalled();
        expect(userAccessControlServiceStub.deleteRole).toHaveBeenCalled();
      }));
      it('alerts on failure', fakeAsync(() => {
        const roleStub: Role = fixture.debugElement.injector.get(Role);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deleteRole').and.returnValue(Promise.reject('Failed to delete role'));
        component.onDeleteRole(roleStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
  });
  describe('Features', () => {
    describe('toggleFeature', () => {
      it('makes expected calls', () => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        spyOn(component, 'setState');
        component.toggleFeature(featureStub);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreateFeature', () => {
      it('creates a feature', () => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createFeature').and.returnValue(Promise.resolve({ _id: 0 }));
        component.onCreateFeature(featureStub);
        expect(userAccessControlServiceStub.createFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createFeature').and.returnValue(Promise.reject('Failed to create feature'));
        component.onCreateFeature(featureStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyFeature', () => {
      it('makes expected calls', () => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'updateFeature').and.returnValue(Promise.resolve());
        component.onModifyFeature(featureStub);
        expect(userAccessControlServiceStub.updateFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'updateFeature').and.returnValue(Promise.reject('Failed to modify feature'));
        component.onModifyFeature(featureStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeleteFeature', () => {
      it('makes expected calls', () => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'deleteFeature').and.returnValue(Promise.resolve());
        component.onDeleteFeature(featureStub);
        expect(userAccessControlServiceStub.deleteFeature).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const featureStub: Feature = fixture.debugElement.injector.get(Feature);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deleteFeature').and.returnValue(Promise.reject('Failed to delete feature'));
        component.onDeleteFeature(featureStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
  });
  describe('Permissions', () => {
    beforeEach(() => {
      const mockFeature = {
        _id: '0',
        name: 'test',
        route: '/test',
        permissions: [{
          _id: '0',
          perm_id: '0',
          name: 'test'
        }]
      }
      const mockRole = {
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
          name: 'test',
          displayName: 'tester',
          email: 'test@test.com'
        }]
      }
      component.features.push(mockFeature);
      component.selectedFeature = mockFeature;
      component.roles.push(mockRole);
      component.selectedRole = mockRole;
    });

    describe('onTogglePermission', () => {
      it('makes expected calls', () => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        spyOn(component, 'setState');
        component.onTogglePermission(permissionStub);
        expect(component.setState).toHaveBeenCalled();
      });
    });
    describe('onCreatePermission', () => {
      it('makes expected calls', () => {

        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'createPermission').and.returnValue(Promise.resolve({ perm_id: 0 }));
        component.onCreatePermission(permissionStub);
        expect(userAccessControlServiceStub.createPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'createPermission').and.returnValue(Promise.reject('Failed to create permission'));
        component.onCreatePermission(permissionStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onModifyPermission', () => {
      it('makes expected calls', () => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(userAccessControlServiceStub, 'modifyPermission').and.returnValue(Promise.resolve());
        component.onModifyPermission(permissionStub);
        expect(userAccessControlServiceStub.modifyPermission).toHaveBeenCalled();
      });
      it('alerts on failure', fakeAsync(() => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'modifyPermission').and.returnValue(Promise.reject('Failed to modify permission'));
        component.onModifyPermission(permissionStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onDeletePermission', () => {
      it('makes expected calls', fakeAsync(() => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setState');
        spyOn(userAccessControlServiceStub, 'deletePermission').and.returnValue(Promise.resolve());;
        component.onDeletePermission(permissionStub);
        tick();
        expect(component.setState).toHaveBeenCalled();
        expect(userAccessControlServiceStub.deletePermission).toHaveBeenCalled();
      }));
      it('alerts on failure', fakeAsync(() => {
        const permissionStub: Permission = fixture.debugElement.injector.get(Permission);
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'deletePermission').and.returnValue(Promise.reject('Failed to delete permission'));
        component.onDeletePermission(permissionStub);
        tick();
        expect(component.setErrorMessage).toHaveBeenCalled();
      }));
    });
    describe('onAddPermissionToRole', () => {
      it('makes expected calls', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'connectRoleWithPermission');
        component.onAddPermissionToRole(permissionStub);
        expect(component.setErrorMessage).toHaveBeenCalled();
        expect(
          userAccessControlServiceStub.connectRoleWithPermission
        ).toHaveBeenCalled();
      });
    });
    describe('onRemovePermissionFromRole', () => {
      it('makes expected calls', () => {
        const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
          UserAccessControlService
        );
        spyOn(component, 'setErrorMessage');
        spyOn(userAccessControlServiceStub, 'disconnectRoleFromPermission');
        component.onRemovePermissionFromRole(permissionStub);
        expect(component.setErrorMessage).toHaveBeenCalled();
        expect(
          userAccessControlServiceStub.disconnectRoleFromPermission
        ).toHaveBeenCalled();
      });
    });
  });

  describe('onAddUserToRole', () => {
    it('makes expected calls', () => {
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'addUserToRole');
      component.onAddUserToRole(userStub, roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(userAccessControlServiceStub.addUserToRole).toHaveBeenCalled();
    });
  });
  describe('onRemoveUserFromRole', () => {
    it('makes expected calls', () => {
      const roleStub: Role = fixture.debugElement.injector.get(Role);
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setErrorMessage');
      spyOn(userAccessControlServiceStub, 'removeUserFromRole');
      component.onRemoveUserFromRole(userStub, roleStub);
      expect(component.setErrorMessage).toHaveBeenCalled();
      expect(
        userAccessControlServiceStub.removeUserFromRole
      ).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const userAccessControlServiceStub: UserAccessControlService = fixture.debugElement.injector.get(
        UserAccessControlService
      );
      spyOn(component, 'setMetaData');
      spyOn(userAccessControlServiceStub, 'getViewModel');
      component.ngOnInit();
      expect(component.setMetaData).toHaveBeenCalled();
      expect(userAccessControlServiceStub.getViewModel).toHaveBeenCalled();
    });
  });
});
